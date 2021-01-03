const {validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Role = require("../models/Role")
const jwt = require("jsonwebtoken")

class AuthService {

    async registration(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send(errors.array())
        }
        try {
            const username = req.body.username
            const isUserExist = (await User.findOne({username: username})) !== null
            if (isUserExist)
                res.status(400).send({message: `User ${username} is already exist!`})
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

            const token = this.createJWT({username: user.username, roles: user.roles})
            res.send({token})
        }
        catch (e) {
            res.status(400).send({message: e.message})
        }

    }

    async login(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.send(errors.array())
        }
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user)
            res.status(400).send({message: `User ${username} is not found.`})
        const isSuccessAuth = bcrypt.compareSync(password, user.password)
        if (!isSuccessAuth)
        {
            res.status(400).send({message: "Incorrect password."})
        }
        const token = this.createJWT({username: user.username, roles: user.roles})
        res.send({token})
    }

    async authentication(req, res) {
        const token = req.headers.authorization.split(" ")[1]
        if (!token)
            res.status(401).send("Authorization token is empty")
        try {
            const decodedUser = jwt.verify(token, process.env.PRIVATE_KEY)
            res.status(200).send()
        }
        catch (e) {
            res.status(400).send({message: e.message})
        }
    }

    createJWT(user) {
        const token = jwt.sign(user, process.env.PRIVATE_KEY)
        return token
    }

}
