const express = require("express")
const router = express.Router()
const AuthService = require("../../../services/AuthService")

router.post("/registration", AuthService.registration)
router.post("/authentication", AuthService.authentication)
router.post("/login", AuthService.login)
router.post("/refresh", AuthService.refresh)

module.exports = router


