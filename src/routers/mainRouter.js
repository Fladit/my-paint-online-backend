const express = require("express")
const router = express.Router()
const ApiRouter = require("./api/apiRouter")
const drawSocketService = require("../services/DrawSocketService")
const AuthMiddleware = require("../middleware/authentication.middleware").socketAuthentication


router.use("/api", ApiRouter)
router.ws("/draw/:uid", (ws, req) => {
    AuthMiddleware(ws, req)
    const sessionID = req.params.uid
    //const token = req.query.token
    const user = req.current.user

    drawSocketService.onOpenEvent(sessionID, user, ws).then(() => {
        ws.on("message", (message) => {
            drawSocketService.onMessageEvent(sessionID, ws, message)
        })

        ws.on("close", () => {
            drawSocketService.onCloseEvent(sessionID, ws)
        })
    }).catch(err => {ws.close(err.message)})
})

module.exports = router


