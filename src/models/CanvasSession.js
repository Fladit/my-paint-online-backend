const {Schema, model} = require("mongoose")

const CanvasSessionSchema = new Schema({
    sessionID: {
        type: String,
        required: true,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

module.exports = model("CanvasSession", CanvasSessionSchema)
