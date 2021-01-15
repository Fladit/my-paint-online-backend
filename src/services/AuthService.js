const {validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Role = require("../models/Role")
const jwt = require("jsonwebtoken")

class AuthService {

    async registration(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json(errors.array())
        }
        try {
            const username = req.body.username
            const isUserExist = (await User.findOne({username: username})) !== null
            if (isUserExist)
                res.status(400).json({message: `User ${username} is already exist!`})
            const password = req.body.password
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            let userRole = await Role.findOne({value: "USER"})
            if (!userRole) {
                userRole = new Role({
                    value: "USER",
                })
                await userRole.save()
            }
            const user = new User({
                username,
                password: hash,
                roles: [userRole]
            })
            await user.save()

            const token = AuthService.createJWT({username: user.username, roles: user.roles}, "1h")
            res.json({token})
        }
        catch (e) {
            console.log(e.message)
            res.status(400).json({message: e.message})
        }

    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.json(errors.array())
            }
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user)
                res.status(400).json({message: `User ${username} is not found.`})
            const isSuccessAuth = bcrypt.compareSync(password, user.password)
            if (!isSuccessAuth) {
                res.status(400).json({message: "Incorrect password."})
            }
            const token = AuthService.createJWT({username: user.username, roles: user.roles}, "1h")
            res.json({token})
        }
        catch (e) {
            res.status(400).json({message: e.message})
        }
    }

    async authentication(req, res) {
        const bearerToken = req.headers.authorization
        if (!bearerToken)
            res.status(401).json("Authorization token is empty")
        const token = bearerToken.split(" ")[1]
        if (!token)
            res.status(401).json("Authorization token is empty")
        try {
            const decodedUser = jwt.verify(token, process.env.PRIVATE_KEY)
            res.status(200).json({message: "Token is valid"})
        }
        catch (e) {
            console.log(e.message)
            res.status(400).json({message: e.message})
        }
    }

    static createJWT(user, expiresIn) {
        const token = jwt.sign(user, process.env.PRIVATE_KEY, {expiresIn})
        console.log("token: ", token)
        return token
    }

}

module.exports = new AuthService()
