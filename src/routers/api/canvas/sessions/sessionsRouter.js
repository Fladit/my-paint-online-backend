const express = require("express")
const router = express.Router()
const CanvasService = require("../../../../services/CanvasSerivce")
const AuthenticationMiddleware = require("../../../../middleware/authentication.middleware").authentication

router.post("/", AuthenticationMiddleware, CanvasService.createCanvasSession)
router.get("/:id", AuthenticationMiddleware, CanvasService.getSession)

module.exports = router
