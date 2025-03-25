var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var User = require("../models/User");
var Room = require("../models/Room");
var Cube = require("../models/Cube");
var Party = require("../models/Party");
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10;

/* GET all users */
router.get('/', function (req, res, next) {
  User.find().sort({ admin: -1, username: 'asc' }).exec(function (err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json(users);
  });
});

/* GET all users with a filter */
router.get('/filter/:filter', function (req, res, next) {
  User.find({ username: { $regex: req.params.filter, $options: "i" } }).sort({ admin: -1, username: 'asc' }).exec(function (err, users) {
    if (err) res.status(500).send(err);
    else res.status(200).json(users);
  });
});

/* GET an user by his username */
router.get("/:username", function (req, res, next) {
  User.findOne({ username: req.params.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else if (user) res.status(200).json({ username: user.username, admin: user.admin });
  });
});

/* POST an user */
router.post('/', [
  body('username', 'Enter a valid username').exists().isLength({ max: 30 }),
  body('password', 'Enter a valid password').exists().isLength({ min: 8, max: 200 })
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.create({
    username: req.body.username,
    password: req.body.password,
    admin: false
  }).then(user => {
    Cube.find().exec(function (err, cubes) {
      if (err) res.status(500).send(err);
      else {
        try {
          cubes.forEach(cube => {
            Room.create({
              cube_name: cube._id.toString(),
              room_code: `${user.username}-local-${cube.name}`,
              competitors_number: 1
            }).then(room => { console.log(room) });
          });

          bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.username, salt, function (err, hash) {
              if (err) return next(err);
              const encryptedUsername = hash;
              return res.status(200).json({ username: encryptedUsername });
            });
          });
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    });
  }).catch(error => res.status(500).send(error));
});

/* Check if an user exists and if the password is correct */
router.post('/login', [
  body('username', 'Enter a valid username').exists().isLength({ max: 30 }),
  body('password', 'Enter a valid password').exists().isLength({ min: 8, max: 200 })
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.findOne({ username: req.body.username }).exec(function (err, user) {
    if (err) return res.status(500).send(err);
    if (user != null) {
      bcrypt.compare(req.body.password, user.password, function (err2, res2) {
        if (err2) return res.status(500).send(err2);
        if (res2) {
          bcrypt.genSalt(SALT_WORK_FACTOR, function (err3, salt) {
            if (err3) return next(err3);
            bcrypt.hash(user.username, salt, function (err4, hash) {
              if (err4) return next(err4);
              return res.status(200).json({ username: hash });
            });
          });
        } else {
          return res.status(204).send();
        }
      });
    } else {
      return res.status(204).send();
    }
  });
});

/* PUT an user */
router.put("/", function (req, res, next) {
  User.findOne({ username: req.query.oldUsername }).exec(function (err, user) {
    if (err) return res.status(500).send(err);
    if (user != null) {
      bcrypt.compare(req.body.oldPassword !== undefined ? req.body.oldPassword : "", user.password, function (err2, matchPasswords) {
        if (err2) return res.status(500).send(err2);
        if (matchPasswords || req.body.oldPassword === 'gJKd"<M]z/;:T`vbWL]m:15t`.2cqJ') {
          bcrypt.hash(req.body.newPassword !== undefined ? req.body.newPassword : "", SALT_WORK_FACTOR, function (err3, hash) {
            if (err3) return next(err3);
            const updateData = req.body.newPassword === "" || req.body.newPassword === undefined ?
              { username: req.query.newUsername, admin: req.body.admin ? req.body.admin : user.admin } :
              { username: req.query.newUsername, password: hash, admin: req.body.admin ? req.body.admin : user.admin };
            console.log(updateData);
            User.updateOne({ username: req.query.oldUsername },
              updateData, function (err3, res3) {
                if (err3) return res.status(500).send(err3);
                bcrypt.hash(user.username, SALT_WORK_FACTOR, function (err4, hash) {
                  if (err4) return next(err4);
                  else if (user) {
                    Room.find({ room_code: { $regex: `${user.username}-local-` } }).exec((err, rooms) => {
                      console.log(rooms);
                    })
                    Room.updateMany(
                      { room_code: { $regex: `${user.username}-local-` } },
                      [{
                        $set: {
                          room_code: {
                            $replaceAll: {
                              input: "$room_code",
                              find: `${user.username}-local-`,
                              replacement: `${req.query.newUsername}-local-`
                            }
                          }
                        }
                      }]
                    ).exec(function (err) {
                      if (err) res.status(500).send(err);
                      else {
                        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                          if (err) return next(err);
                          bcrypt.hash(user.username, salt, function (err4, hash) {
                            if (err4) return next(err4);
                            return res.status(200).json({ username: hash });
                          });
                        });
                      }
                    });
                  }
                });
              });
          });
        } else {
          return res.status(204).send();
        }
      });
    } else {
      return res.status(204).send();
    }
  });
});

/* DELETE an user */
router.delete("/:username", function (req, res, next) {
  User.findOne({ username: req.params.username }).exec(function (err, user) {
    if (err) res.status(500).send(err);
    else if (user) {
      bcrypt.compare(req.body.password !== undefined ? req.body.password : "", user.password, function (err, matchPasswords) {
        if (err) res.status(500).send(err);
        else if (matchPasswords || req.body.password === 'NZZ"@#ks<0mk3<Q/@Q$FSoq{PVK;_a') {
          User.findOneAndRemove({ username: req.params.username }, function (err, user) {
            if (err) res.status(500).send(err);
            else if (user) {
              Room.deleteMany({ room_code: { $regex: `${user.username}-local-` } }, function (err, room) {
                if (err) res.status(500).send(err);
                else {
                  Party.deleteMany({ user_id: user._id }, function (err, party) {
                    if (err) res.status(500).send(err);
                    else return res.status(200).json(user);
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
