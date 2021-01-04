const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()
const ApiRouter = require("./src/routers/api/apiRouter")
const PORT = process.env.PORT || 5000


app.use(express.json())
app.use("/api", ApiRouter)


const startServer = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.b9vna.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            {useNewUrlParser: true, useUnifiedTopology: true},);
        app.listen(PORT, () => {
            console.log(`Server is started on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e.message)
    }
}

startServer()
