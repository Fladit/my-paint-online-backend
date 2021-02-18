const express = require("express")
const router = express.Router()
const CanvasSession = require("../../../models/CanvasSession")
const CanvasService = require("../../../services/CanvasSerivce")
const AuthenticationMiddleware = require("../../../middleware/authentication.middleware").authentication

//router.use(AuthenticationMiddleware)
router.post("/createSession", AuthenticationMiddleware, CanvasService.createCanvasSession)
router.post("/sessions/:uid", AuthenticationMiddleware, CanvasService.getSession)
module.exports = router
