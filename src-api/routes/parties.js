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

  const times = [];

  for (
    let i = solvesAmount - 1;
    i > solvesAmount - avgAmount - 1;
    i--
  ) {
    times.push(
      parseTimeToMilliseconds(
        solves.solve_ids[i].time
      )
    );
  }

  const filteredTimes =
    removeBestAndWorstTime(times, outAmount);

  const total =
    filteredTimes.reduce(
      (sum, current) => sum + current,
      0
    );

  const average =
    Math.round(total / filteredTimes.length);

  return formatMilliseconds(average);
}

function removeBestAndWorstTime(times, outAmount) {
  const sorted = [...times].sort((a, b) => a - b);

  return sorted.slice(outAmount, sorted.length - outAmount);
}

function formatTime(minutesMo3, secondsMo3) {
  if (minutesMo3.indexOf(".") !== -1) {
    secondsMo3 = Number.parseFloat((Number.parseFloat(secondsMo3) + Number.parseFloat("0." + minutesMo3.substring(minutesMo3.indexOf(".") + 1)) * 60).toFixed(2));
    minutesMo3 = Math.floor(Number.parseFloat(minutesMo3));
  }

  secondsMo3 = !isNaN(minutesMo3) && secondsMo3 < 10 ? "0" + secondsMo3 : secondsMo3;

  return !isNaN(minutesMo3) ? `${minutesMo3}:${secondsMo3} m` : `${secondsMo3} s`;
}

function parseTimeToMilliseconds(timeString) {
  timeString = timeString.trim();

  // Ejemplo: "1:05.34 m"
  if (timeString.includes(":")) {
    const minutes = parseInt(
      timeString.substring(0, timeString.indexOf(":")),
      10
    );

    const seconds = parseFloat(
      timeString.substring(
        timeString.indexOf(":") + 1,
        timeString.length - 2
      )
    );

    return Math.round((minutes * 60 + seconds) * 1000);
  }

  // Ejemplo: "13.42 s"
  const seconds = parseFloat(
    timeString.substring(0, timeString.length - 2)
  );

  return Math.round(seconds * 1000);
}

function formatMilliseconds(ms) {
  const totalSeconds = ms / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(2)} s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");

  return `${minutes}:${seconds} m`;
}

/* DELETE all solves of current cube party */
router.delete('/all', function (req, res, next) {
  Cube.findOne({ name: req.query.cube_name }).exec(function (err, cube) {
    if (err) return res.status(500).send(err);
    if (!cube) return res.status(404).send("Cube not found");

    Room.findOne({
      room_code: req.query.room_code,
      cube_name: cube._id
    }).exec(function (err, room) {
      if (err) return res.status(500).send(err);
      if (!room) return res.status(404).send("Room not found");

      User.findOne({ username: req.query.username }).exec(function (err, user) {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("User not found");

        Party.findOne({
          "data.user_id": user._id,
          "data.room_id": room._id
        }).populate("solve_ids").exec(async function (err, party) {
          if (err) return res.status(500).send(err);
          if (!party) return res.status(404).send("Party not found");

          const solveIds = party.solve_ids.map(s => s._id);

          try {
            // borrar solves reales
            await Solve.deleteMany({ _id: { $in: solveIds } });

            // limpiar party
            party.solve_ids = [];
            await party.save();

            return res.status(200).json({ success: true });
          } catch (e) {
            return res.status(500).send(e);
          }
        });
      });
    });
  });
});

module.exports = router;
