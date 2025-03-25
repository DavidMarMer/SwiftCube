var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
    cube_name: {
        type: Schema.ObjectId,
        ref: "Cube",
        required: true,
    },
    room_code: {
        type: String,
        required: true,
        index:{
            unique: true
        }
    },
    competitors_number: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Room', RoomSchema);