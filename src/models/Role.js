const {Schema, model} = require("mongoose")

const RoleSchema = new Schema({
    value: {
        type: String,
        required: true,
        unique: true,
    }
})

module.exports = model("Role", RoleSchema)
