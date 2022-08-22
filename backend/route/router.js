const express = require("express")
const adminModel = require("../models/Admin")
const { 
    getEmployes, 
    addEmployee, 
    getSingleEmployee, 
    UpdateEmployee, 
    deleteEmployee,
    searchEmployes} = require("../Controllers/usersController")
const { 
    signUpEmployee, 
    getUser, 
    updateEmployeeRecord,
    searchEmployee,
    applyForLeave} = require("../Controllers/emplController")

const router = express.Router()
const userModel = require("../models/User")

router.get("/get_employes", getEmployes)
router.post("/add_employee", addEmployee)
router.post("/get_single_employee", getSingleEmployee)
router.post("/update_employee", UpdateEmployee)
router.post("/delete_employee", deleteEmployee)
router.post("/search_employes", searchEmployes)


router.post("/signup_as_employee", signUpEmployee)
router.get("/get_user/:id", getUser)
router.post("/update_employee_data", updateEmployeeRecord)
router.post("/search-employee-data", searchEmployee)
router.post("/leave/:id", applyForLeave)




router.post("/save_user", async(req, res) => {
    const {id, pin} = req.body
    try {
        const userExist = await userModel.findOne({$and: [{id}, {pin}]})
        if(userExist){
            res.status(201).send(userExist)
        }
        else{
            res.status(404).json({message: "Not Exist"})
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/save_admin", async(req, res) => {
    const {id, pin} = req.body
    try {
        const result = await adminModel.findOne({id, pin})
        if(result){
            res.status(200).send(result)
        }else{
            res.status(404).json({message: "User not Found"})
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/save_new_user", async(req, res) => {
    const {id, pin} = req.body
    try {
        const userExist = await userModel.findOne({$and: [{id}, {pin}]})
        const userExist2 = await userModel.findOne({$or: [{id}, {pin}]})
        if(userExist){
            res.status(400).send(userExist)
        }
        else if(userExist2){
            res.status(401).send(userExist2)
        }
        else{
            const data = new userModel({
                name: "",
                mobile: "",
                email: "",
                id,pin,
                duty: "9 AM - 6 PM"
            })
            const result = await data.save()
            res.status(200).send(result)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/update_user_info", async(req, res) => {
    const {id, name, mobile, email} = req.body
    try {
        const data = await userModel.updateOne(
            {_id: id},
            {$set: {name,mobile,email}}
        )
        res.status(200).send(data)
    } catch (error) {
        console.error(error)
    }
})

router.get("/:id", async(req, res) => {
    const _id = req.params.id
    try {
        const data = await userModel.findOne({_id})
        res.status(200).send(data)
    } catch (error) {
        console.error(error)
    }
})


router.post("/punch/:id", async(req, res) => {
    const _id = req.params.id

    const start = new Date().toLocaleTimeString()
    const end = "06:00:00 PM"
    const today = new Date().toDateString()
    const leave = "no";

    try {
        const findUser = await userModel.findOne({_id})
        const result = await findUser.generateStartToken(today, start, end, leave)
        console.log(result)
        res.status(200).send(result)
    } catch (error) {
        console.error(error)
    }
})

// router.post("/leave/:id", async(req, res) => {
//     const _id = req.params.id

//     const start = ""
//     const end = ""
//     const today = new Date().toDateString()
//     const leave = "yes";

//     try {
//         const findUser = await userModel.findOne({_id})
//         const result = await findUser.generateStartToken(today, start, end, leave)
//         console.log(result)
//         res.status(200).send(result)
//     } catch (error) {
//         console.error(error)
//     }
// })

router.post("/update/:id", async(req, res) => {
    const _id = req.params.id
    console.log(_id)

    const end = new Date().toLocaleTimeString()
    const date = new Date().toDateString()

    try {
        const updateEnd = await userModel.updateOne(
            {
                _id,
                'schedule': {
                    $elemMatch: {date: date}
                }
            },
            {$set: {'schedule.$[o].end':end}},
            {arrayFilters: [{'o.date': date}]}
        )
        res.status(200).send(updateEnd)
    } catch (error) {
        console.error(error)
    }
})

router.get("/admin/:id", async(req, res) => {
    const id = req.params._id
    try {
        const result = await adminModel.findOne()
        const result2 = await userModel.find()
        if(result){
            res.status(200).send({result, result2})
        }else{
            res.status(404).json({message: "User not Found"})
        }
    } catch (error) {
        console.error(error)
    }
})

router.get("/search/:id", async(req, res) => {
    const search = req.params.id
    console.log("Search "+search)
    try {
        if(search){
            const result = await userModel.find({
                $or:[{'name': new RegExp(search, "i")},
                    {'email': new RegExp(search, "i")},
                    {'id': new RegExp(search, "i")},
                ]
            })
            res.status(404).send(result)
        }else{
            const result = await userModel.find({})
            res.status(404).send(result)
        }
    } catch (error) {
        console.error(error)
    }
})

router.post("/search_records", async(req, res) => {
    const {dateVal, pin} = req.body
    console.log(dateVal, pin)
    try {
        const data = await userModel.findOne(
            {   pin,
                'schedule': {
                    $elemMatch: {
                        date: dateVal
                    }
                }
            }
        )
        let result
        if(data === null){
            result = {}
        }else{
            result = data
        }
        res.status(200).send(result)
    } catch (error) {
        console.error(error)
    }
})

router.post("/get_available", async(req, res) => {
    const todayDate = new Date().toDateString();
    try {
        const result = await userModel.find(
            {'schedule': {
                $elemMatch: {
                    date: todayDate,
                    leave: "no",
                    end: {$eq: "06:00:00 PM"}
                }
            }}
        )
        console.log(result)
        res.status(404).send(result)
    } catch (error) {
        console.error(error)
    }
})

router.post("/get_unavailable", async(req, res) => {
    const todayDate = new Date().toDateString();
    try {
            const result = await userModel.find(
                {'schedule': {
                    $elemMatch: {
                        date: todayDate,
                        leave: "no",
                        end: {$ne: "" || "06:00:00 PM"}
                    }
                }}
            )
            console.log(result)
            res.status(404).send(result)
    } catch (error) {
        console.error(error)
    }
})

router.post("/get_onleave", async(req, res) => {
    try {
            const result = await userModel.find(
                {'schedule': {
                    $elemMatch: {
                        leave: "yes"
                    }
                }}
            )
            console.log(result)
            res.status(404).send(result)
    } catch (error) {
        console.error(error)
    }
})

router.post("/admin_settings", async(req, res) => {
    try {
        const result = await userModel.find({})
        res.status(200).send(result)
    } catch (error) {
        console.error(error)
    }
})
module.exports = router