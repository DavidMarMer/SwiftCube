var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartySchema = new Schema({
    data: {
        user_id: {
            type: Schema.ObjectId,
            ref: "User",
            required: true
        },
        room_id: {
            type: Schema.ObjectId,
            ref: "Room",
            required: true
        }
    },
    solve_ids: {
        type: [{ type: Schema.ObjectId, ref: "Solve" }],
        required: true
    }
});

// Unique index in data.user_id and data.room_id together
PartySchema.index({ "data.user_id": 1, "data.room_id": 1 }, { unique: true });

module.exports = mongoose.model('Party', PartySchema);