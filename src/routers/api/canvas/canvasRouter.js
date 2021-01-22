const express = require("express")
const router = express.Router()
const CanvasSession = require("../../../models/CanvasSession")
const CanvasService = require("../../../services/CanvasSerivce")

router.post("/createSession", CanvasService.createCanvasSession)

module.exports = router
