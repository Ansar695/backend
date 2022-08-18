const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    role: String,
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
    },
    duty: {
        type: String
    },
    schedule: [{
        date: {
            type: String,
        },
        start: {
            type: String,
        },
        end: {
            type: String,
        },
        leave:{
            type: String,
        }
    }]
})

userSchema.methods.generateStartToken = async function(today, start, end, leave){
    try {
        this.schedule = this.schedule.concat({date: today, start, end, leave})
        await this.save()
        return this.schedule
    } catch (error) {
        console.error(error)
    }
}

const userModel = new mongoose.model("user", userSchema)
module.exports = userModel