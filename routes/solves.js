var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Solve = require("../models/Solve");
var Party = require("../models/Party");
var Room = require("../models/Room");
var User = require("../models/User");

/* POST a solve */
router.post('/', [
  body('time', 'Enter a valid time').exists(),
  body('scramble', 'Enter a valid scramble').exists(),
  body('video', 'Enter a valid scramble')
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const video = req.body.video !== undefined ? req.body.video : "";
  Solve.create({
    time: req.body.time,
    scramble: req.body.scramble,
    date: Date.now(),
    video: video
  }).then(solve => {
    return res.status(200).json(solve);
  }).catch(error => res.status(500).send(error));
});

/* DELETE a solve */
router.delete('/', function (req, res, next) {
  /*
   * Search User by username and get ID
   * Search Room by room_code and get ID
   * Search party by User ID and Room ID
   * Get Solve position in array using <solve_position>
   * Get Solve ID and delete it from the array
   * Delete Solve by ID
   */
  Room.findOne({ room_code: req.query.room_code }).exec(function (err, room) {
    if (err) res.status(500).send(err)
    else if (room) {
      User.findOne({ username: req.query.username }).exec(function (err, user) {
        if (err) return res.status(500).send(err)
        else if (user) {
          Party.findOne({ "data.user_id": user._id, "data.room_id": room._id }
          ).populate("solve_ids").exec(function (err, party) {
            if (err) res.status(500).send(err);
            else if (party) {
              const idToRemove = party.solve_ids[req.query.solve_position]._id;

              party.solve_ids.splice(req.query.solve_position, 1);

              Solve.findByIdAndRemove(idToRemove, function (err, solve) {
                if (err) res.status(500).send(err);
                else res.status(200).json(solve);
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
