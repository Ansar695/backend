const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    id: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    login_at:{
        type: Date,
        default: new Date().toDateString()
    }
})

const adminModel = new mongoose.model("admin", adminSchema)
module.exports = adminModel