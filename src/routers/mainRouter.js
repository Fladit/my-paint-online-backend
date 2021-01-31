const express = require("express")
const router = express.Router()
const ApiRouter = require("./api/apiRouter")
const drawSocketService = require("../services/DrawSocketService")


router.use("/api", ApiRouter)
router.ws("/draw/:uid", (ws, req) => {
    const sessionID = req.params.uid
    const token = req.query.token

    drawSocketService.onOpenEvent(sessionID, token, ws).then(() => {
        ws.on("message", (message) => {
            drawSocketService.onMessageEvent(sessionID, ws, message)
        })

        ws.on("close", () => {
            drawSocketService.onCloseEvent(sessionID, ws)
        })
    }).catch(err => {ws.close(err.message)})
})

module.exports = router


