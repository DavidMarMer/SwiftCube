var express = require('express');
var app = express();
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Party = require("../models/Party");
var User = require("../models/User");
var Room = require("../models/Room");
var Solve = require("../models/Solve");
var Cube = require("../models/Cube");

/* GET actual party */
router.get('/actual', function (req, res, next) {
  Cube.findOne({ name: req.query.cube_name }).exec(function (err, cube) {
    if (err) return res.status(500).send(err)
    else if (cube) {
      Room.findOne({ room_code: req.query.room_code, cube_name: cube._id }).exec(function (err, room) {
        if (err) return res.status(500).send(err)
        else if (room) {
          User.findOne({ username: req.query.username }).exec(function (err, user) {
            if (err) return res.status(500).send(err)
            else if (user) {
              Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }
              ).populate("solve_ids").exec(function (err, party) {
                if (err) res.status(500).send(err);
                else if (party) {
                  const avgs = getAllAverages(party.solve_ids.length, party);
                  return res.status(200).json({ party, avgs });
                }
                else return res.status(204).send();
              });
            } else return res.status(204).send();
          });
        } else return res.status(204).send();
      });
    }
  });
});

/* POST a party */
router.post('/', [
  body('time', 'Enter a valid time').exists(),
  body('scramble', 'Enter a valid scramble').exists(),
  body('video', 'Enter a valid video'),
  body('username', 'Enter a valid username').exists(),
  body('room', 'Enter a valid room').exists(),
  body('cube_name', 'Enter a valid cube name').exists(),
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Searches the user by his username
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else {
      const video = req.body.video !== undefined ? req.body.video : "";
      Solve.create({
        time: req.body.time,
        scramble: req.body.scramble,
        date: Date.now(),
        video: video
      }).then(solve => {
        Cube.findOne({ name: req.body.cube_name }).exec(function (err, cube) {
          if (err) return res.status(500).send(err)
          else if (cube) {
            Room.findOne({ room_code: req.body.room, cube_name: cube._id }).exec(function (err, room) {
              if (err) res.status(500).send(err);
              else if (user) {
                if (!room) {
                  Room.create({
                    cube_name: cube._id,
                    room_code: req.body.room,
                    competitors_number: 1
                  }).then(room => {
                    if (err) res.status(500).send(err);
                    else manageParty(user, solve, room, err, res);
                  });
                  console.log("room creada");
                } else {
                  manageParty(user, solve, room, err, res);
                }
              } else {
                return res.status(500).send("User is null");
              }
            });
          }
        });
      }).catch(error => {
        return res.status(500).send(error);
      });
    }
  });
});

function manageParty(user, solve, room, err, res) {
  // If the party (user + room) exists, adds the solve. If not, creates a new one and with that first solve
  Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }).exec(function (err, party) {
    if (err) res.status(500).send(err);
    else if (party !== null) {
      // Adds the solve to the party solves list
      party.solve_ids.push(solve._id);
      party.save();
      party.populate("solve_ids", function (err, solves) {
        const solvesAmount = solves.solve_ids.length;
        const lastSolve = solves.solve_ids[solvesAmount - 1];
        const avgs = getAllAverages(solvesAmount, solves);

        return res.status(200).json({ lastSolve, solvesAmount, avgs });
      });
    } else {
      // Creates the party with that first solve
      Party.create({
        data: {
          user_id: user._id.toString(),
          room_id: room._id.toString()
        },
        solve_ids: [solve._id.toString()]
      }).then(party => {
        party.populate("solve_ids", function (err, solves) {
          const solvesAmount = solves.solve_ids.length;
          const lastSolve = solves.solve_ids[solvesAmount - 1];
          const avgs = getAllAverages(solvesAmount, solves);

          return res.status(200).json({ lastSolve, solvesAmount, avgs });
        });
      }).catch(error => res.status(500).send(error));
    }
  });
}

function getAllAverages(solvesAmount, solves) {
  const avgs = [];

  if (solvesAmount >= 3) {
    avgs.push(calculateAverage(solves, 3, 0));
    if (solvesAmount >= 5) {
      avgs.push(calculateAverage(solves, 5, 1));
      if (solvesAmount >= 12) {
        avgs.push(calculateAverage(solves, 12, 1));
        if (solvesAmount >= 25) {
          avgs.push(calculateAverage(solves, 25, 2));
          if (solvesAmount >= 50) {
            avgs.push(calculateAverage(solves, 50, 3));
            if (solvesAmount >= 100) {
              avgs.push(calculateAverage(solves, 100, 5));
              if (solvesAmount >= 200) {
                avgs.push(calculateAverage(solves, 200, 10));
                if (solvesAmount >= 500) {
                  avgs.push(calculateAverage(solves, 500, 25));
                  if (solvesAmount >= 1000) {
                    avgs.push(calculateAverage(solves, 1000, 100));
                    if (solvesAmount >= 2000) {
                      avgs.push(calculateAverage(solves, 2000, 200));
                      if (solvesAmount >= 10000) {
                        avgs.push(calculateAverage(solves, 10000, 500));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return avgs;
}

function calculateAverage(solves, avgAmount, outAmount) {
  const solvesAmount = solves.solve_ids.length;
  let minutesSum = 0;
  let minutesCont = 0;
  let secondsSum = 0;
  times = [];

  for (let i = solvesAmount - 1; i > solvesAmount - avgAmount - 1; i--) {
    const solveTime = solves.solve_ids[i].time;
    times.push(solveTime);
  }

  times = removeBestAndWorstTime(times, outAmount);

  for (let i = times.length - 1; i >= 0; i--) {
    const solveTime = times[i];
    if (solveTime.charAt(solveTime.length - 1) === "m") {
      const minutes = solveTime.substring(0, solveTime.indexOf(":"));
      minutesSum += Number.parseInt(minutes);
      secondsSum += Number.parseFloat(solveTime.substring(solveTime.indexOf(":") + 1, solveTime.length - 2));
      minutesCont++;
    } else {
      secondsSum += Number.parseFloat(solveTime.substring(0, solveTime.length - 2));

    }
  }

  let minutesMo3 = (minutesSum / minutesCont).toString();
  let secondsMo3 = (secondsSum / (avgAmount - outAmount * 2)).toFixed(2);

  return formatTime(minutesMo3, secondsMo3);
}

function removeBestAndWorstTime(times, outAmount) {
  let bestTime = 0;
  let bestTimeMinutes, bestTimeSeconds, bestTimeMilliseconds;

  let worstTime = 0;
  let worstTimeMinutes, worstTimeSeconds, worstTimeMilliseconds;
  for (let i = 0; i < outAmount; i++) {
    for (let i = 0; i < times.length; i++) {
      let minutes, seconds;
      if (times[i].indexOf(":") !== -1) {
        minutes = times[i].substring(0, times[i].indexOf(":"));
        seconds = times[i].substring(times[i].indexOf(":") + 1, times[i].indexOf("."));
      } else {
        minutes = 0;
        seconds = times[i].substring(0, times[i].indexOf("."));
      }
      const milliseconds = times[i].substring(times[i].indexOf(".") + 1);

      if (bestTime === 0 ||
        minutes < bestTimeMinutes ||
        minutes === bestTimeMinutes && seconds < bestTimeSeconds ||
        minutes === bestTimeMinutes && seconds === bestTimeSeconds && milliseconds < bestTimeMilliseconds) {
        bestTime = times[i];
        bestTimeMinutes = minutes;
        bestTimeSeconds = seconds;
        bestTimeMilliseconds = milliseconds;

        if (worstTime === 0) {
          worstTime = times[i];
          worstTimeMinutes = minutes;
          worstTimeSeconds = seconds;
          worstTimeMilliseconds = milliseconds;
        }
      } else if (minutes > worstTimeMinutes ||
        minutes === worstTimeMinutes && seconds > worstTimeSeconds ||
        minutes === worstTimeMinutes && seconds === worstTimeSeconds && milliseconds > worstTimeMilliseconds) {
        worstTime = times[i];
        worstTimeMinutes = minutes;
        worstTimeSeconds = seconds;
        worstTimeMilliseconds = milliseconds;
      }
    }

    times.splice(times.indexOf(bestTime), 1);
    times.splice(times.indexOf(worstTime), 1);
  }

  return times;
}

function formatTime(minutesMo3, secondsMo3) {
  if (minutesMo3.indexOf(".") !== -1) {
    secondsMo3 = Number.parseFloat((Number.parseFloat(secondsMo3) + Number.parseFloat("0." + minutesMo3.substring(minutesMo3.indexOf(".") + 1)) * 60).toFixed(2));
    minutesMo3 = Math.floor(Number.parseFloat(minutesMo3));
  }

  secondsMo3 = !isNaN(minutesMo3) && secondsMo3 < 10 ? "0" + secondsMo3 : secondsMo3;

  return !isNaN(minutesMo3) ? `${minutesMo3}:${secondsMo3} m` : `${secondsMo3} s`;
}

module.exports = router;
