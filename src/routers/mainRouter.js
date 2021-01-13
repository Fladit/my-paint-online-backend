const express = require("express")
const router = express.Router()
const ApiRouter = require("./api/apiRouter")
const drawSocketService = require("../services/DrawSocketService")


router.use("/api", ApiRouter)
router.ws("/draw/:uid", (ws, req) => {
    const sessionID = req.param.uid
    ws.on("open", () => {
        drawSocketService.onOpenEvent(sessionID, ws)
    })

    ws.on("message", (message) => {
        drawSocketService.onMessageEvent(sessionID, ws, message)
    })

    ws.on("close", () => {
        drawSocketService.onCloseEvent(sessionID, ws)
    })
})

module.exports = router


