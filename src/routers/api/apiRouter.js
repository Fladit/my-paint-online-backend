const express = require("express")
const router = express.Router()
const AuthRouter = require("./auth/authRouter")
const CanvasRouter = require("./canvas/canvasRouter")

router.use("/auth", AuthRouter)
router.use('/canvas', CanvasRouter)

module.exports = router
