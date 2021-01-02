const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()
const bCrypt = require("bcrypt")


app.use(express.json())

const PORT = process.env.PORT || 5000

const startServer = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.b9vna.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            {useNewUrlParser: true, useUnifiedTopology: true},);
        app.listen(PORT, () => {
            console.log(`Server is started on port ${PORT}`)
        })
        console.log(bCrypt.genSaltSync(10))
    }
    catch (e) {
        console.log(e.message)
    }
}

startServer()
