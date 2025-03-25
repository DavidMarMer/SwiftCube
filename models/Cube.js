var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CubeSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    movement_types: {
        type: String,
        required: true
    },
    movements_number: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cube', CubeSchema);