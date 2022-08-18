require("dotenv").config();
const express = require("express");
const mognoose = require("mongoose")
const router = require("./route/router")
const fileupload = require("express-fileupload")

const app = express()
const port = process.env.PORT || 8000;

require("./DB/database")

app.use(fileupload())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/", router)

app.listen(port, () => console.log(`Server started on port ${port}...`))