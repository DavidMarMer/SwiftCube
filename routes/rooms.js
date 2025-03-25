var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Room = require("../models/Room");

/* GET a room by room code */
router.get("/:oldRoomCode", function (req, res, next) {
  Room.findOne({ room_code: req.params.oldRoomCode }).exec(function (err, room) {
    if (err) res.status(500).send(err);
    else res.status(200).json(room);
  });
});

/* PUT a room */
router.put("/", function (req, res, next) {
  Room.updateOne(
    { room_code: req.query.oldRoomCode },
    req.body,
    function (err, room) {
      if (err) return res.status(500).send(err);
      else return res.status(200).send();
    });
});

module.exports = router;
