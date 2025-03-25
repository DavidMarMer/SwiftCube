var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var Cube = require("../models/Cube");
var Room = require("../models/Room");

/* GET all cubes */
router.get('/', function (req, res, next) {
  Cube.find().exec(function (err, cubes) {
    if (err) res.status(500).send(err);
    else res.status(200).json(cubes);
  });
});

// GET a cube by its name
router.get("/:name", function (req, res, next) {
  Cube.findOne({ name: req.params.name }).exec(function (err, cube) {
    if (err) res.status(500).send(err);
    else res.status(200).json(cube);
  });
});

/* POST a cube */
router.post('/', [
  body('name', 'Enter a valid name').exists(),
  body('movement_types', 'Enter a valid movement_types').exists(),
  body('movements_number', 'Enter a valid movements_number').exists().isNumeric()
], function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Cube.create({
    name: req.body.name,
    movement_types: req.body.movement_types,
    movements_number: req.body.movements_number,
  }).then(cube => { res.json(cube) });
});

/* PUT a cube */
router.put("/:name", [
  body('name', 'Enter a valid name').exists(),
  body('movement_types', 'Enter a valid movement_types').exists(),
  body('movements_number', 'Enter a valid movements_number').exists().isNumeric()
], function (req, res, next) {
  Cube.findOneAndUpdate(
    { name: req.params.name },
    req.body,
    function (err, cube) {
      if (err) res.status(500).send(err);
      else res.status(200).json(cube);
    }
  );
});

/* DELETE a cube */
router.delete("/:name", function (req, res, next) { // En vez de eliminar, sería mejor actualizar y añadir un atributo de "disabled". En el caso en el que se cree uno con el mismo nombre, quitarle este atributo y modificar los demás atributos. Habría que tener en cuenta en el front que muestre todos los que no tengan el atributo "disabled"
  Cube.findOneAndRemove({ name: req.params.name }, function (err, cube) {
    if (err) res.status(500).send(err);
    else if (cube) {
      Room.deleteMany({ cube_name: cube._id }, function (err, room) {
        if (err) res.status(500).send(err);
        else res.status(200).json(cube);
      });
    }
  });
});

module.exports = router;
