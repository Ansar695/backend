const userModel = require("../models/User")

const signUpEmployee = async(req, res) => {
    const {id, name, email, mobile, pin} = req.body
    try {
        const userExist = await userModel.findOne({id})
        if(userExist){
            res.status(400).send(userExist)
        }
        else{
            const data = new userModel({id, pin, name, email, mobile, role: "Engineer", duty: "9 AM - 6 PM"})
            const result = await data.save()
            res.status(200).send(result)
        }
    } catch (error) {
        console.error(error)
    }
}

const getUser = async(req, res) => {
    const _id = req.params.id 
    try {
        const userExist = await userModel.findOne({_id})
        if(userExist){
            res.status(200).send(userExist)
        }
    } catch (error) {
        console.error(error)
    }
}

const updateEmployeeRecord = async(req, res) => {
    const {id, name, mobile, email, role, duty, pin} = req.body
    console.log(req.body)
    try {
        const result = await userModel.updateOne(
            {_id: id},
            {$set: {
                name, mobile, email, role, duty
            }}
        )
        res.status(200).json({message: "Updated successfully."})
        
    } catch (error) {
        console.error(error)
    }
}

const searchEmployee = async(req, res) => {
    const {id, date} = req.body
    console.log(id, date)
    try {
        const result = await userModel.findOne(
            {_id: id,
            'schedule': {
                $elemMatch: {date}
            }
            }
        )
        console.log(result)
        res.status(200).send(result)
        
    } catch (error) {
        console.error(error)
    }
}

const applyForLeave = async(req, res) => {
    const _id = req.params.id
    const start = ""
    const end = ""
    const leave = "yes";
    const today = new Date(req.body.leave).toDateString()
    console.log(req.body)
    console.log(today)
    try {
        const dateExist = await userModel.findOne(
            {_id,
            'schedule': {
                $elemMatch: {date: today}
            }
            }
        )
        if(dateExist){
            res.status(400).json({message: "date already conserved"})
        }else{
            const findUser = await userModel.findOne({_id})
            const result = await findUser.generateStartToken(today, start, end, leave)
            res.status(200).send(result)
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    signUpEmployee,
    getUser,
    updateEmployeeRecord,
    searchEmployee,
    applyForLeave
}