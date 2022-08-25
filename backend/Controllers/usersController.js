const adminModel = require("../models/Admin")
const userModel = require("../models/User")

const getEmployes = async(req, res) => {
    try {
        const result = await userModel.find()
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).json({message: "User not Found"})
        }
    } catch (error) {
        console.error(error)
    }
}

const addEmployee = async(req, res) => {
    const{id, name, email, mobile, role, duty} = req.body
    try {
        const userExist = await userModel.findOne({id})
        const emailExist = await userModel.findOne({email})
        if(userExist || emailExist){
            res.status(201).send(userExist)
        }
        else{
            const data = new userModel({id, pin: "0000", name, email, mobile, role, duty})
            const result = await data.save()
            res.status(200).send(result)
        }
    } catch (error) {
        console.error(error)
    }
}

const getSingleEmployee = async(req, res) => {
    try {
        const result = await userModel.findOne({_id:req.body._id})
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).json({message: "User not Found"})
        }
    } catch (error) {
        console.error(error)
    }
}

const UpdateEmployee = async(req, res) => {
    const {id, name, mobile, email, role, duty} = req.body
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

const deleteEmployee = async(req, res) => {
    const {id} = req.body
    try {
        const result = await userModel.deleteOne({_id: id})
        res.status(200).json({message: "Employee deleted."})
    } catch (error) {
        console.error(error)
    }
}


const searchEmployes = async(req, res) => {
    const {search} = req.body
    try {
        if(search){
            const result = await userModel.find({
                $or:[{'name': new RegExp(search, "i")},
                    {'email': new RegExp(search, "i")},
                    {'id': new RegExp(search, "i")},
                ]
            })
            res.status(200).send(result)
        }else{
            const result = await userModel.find({})
            res.status(201).send(result)
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getEmployes, 
    addEmployee, 
    getSingleEmployee, 
    UpdateEmployee ,
    deleteEmployee,
    searchEmployes
}