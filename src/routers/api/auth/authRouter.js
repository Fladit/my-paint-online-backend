const express = require("express")
const router = express.Router()
const AuthService = require("../../../services/AuthService")

router.post("/registration", AuthService.registration)
router.post("/authentication", AuthService.authentication)
router.post("/login", AuthService.login)

module.exports = router


