const express = require("express")
const app = express()
const expressWs = require("express-ws")(app)
const mongoose = require("mongoose")
require("dotenv").config()
const mainRouter = require("./src/routers/mainRouter")
const cors = require("./src/middleware/cors.middleware")
const PORT = process.env.PORT || 5000

app.use(cors)
app.use(express.json())
app.use("/", mainRouter)


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
