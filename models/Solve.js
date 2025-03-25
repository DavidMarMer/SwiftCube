var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SolveSchema = new Schema({
    time: {
        type: String,
        required: true,
    },
    scramble: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    video: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Solve', SolveSchema);