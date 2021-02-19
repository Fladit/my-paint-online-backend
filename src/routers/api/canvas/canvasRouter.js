const express = require("express")
const router = express.Router()
const SessionsRouter = require("./sessions/sessionsRouter")

//router.use(AuthenticationMiddleware)
router.use("/sessions", SessionsRouter)

module.exports = router
