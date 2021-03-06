const {validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Role = require("../models/Role")
const jwt = require("jsonwebtoken")

const lifeTime = {
    ACCESS: "1m",
    REFRESH: "30d",
}

class AuthService {

    async registration(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        try {
            const username = req.body.username
            const isUserExist = (await User.findOne({username: username})) !== null
            if (isUserExist)
                return res.status(400).json({message: `User ${username} is already exist!`})
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

            const [access, refresh] = AuthService.createJWTtokens({username: user.username, roles: user.roles})
            return res.json({access, refresh})
        }
        catch (e) {
            console.log(e.message)
            return res.status(400).json({message: e.message})
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
            const [access, refresh] = AuthService.createJWTtokens({username: user.username, roles: user.roles})
            res.json({access, refresh})
        }
        catch (e) {
            res.status(400).json({message: e.message})
        }
    }

    async authentication(req, res) {
        const token = AuthService.getTokenWithValidation(req, res)
        if (!token)
            return ;
        try {
            jwt.verify(token, process.env.PRIVATE_KEY)
            res.status(200).send()
        }
        catch (e) {
            res.status(401).json(e)
        }
    }

    async refresh(req, res) {
        const accessToken = AuthService.getTokenWithValidation(req, res)
        if (!accessToken)
            return ;
        const refreshToken = req.body.refresh
        if (!refreshToken) {
            return res.status(401).json({message: "No refresh token"})
        }
        try {
            jwt.verify(accessToken, process.env.PRIVATE_KEY)
            return res.status(200).json({message: "Access token is not expired"})
        }
        catch (e) {
            if (e.name === "TokenExpiredError") {
                try {
                    const userDecoded = jwt.verify(refreshToken, process.env.PRIVATE_KEY)
                    const userData = {username: userDecoded.username, roles: userDecoded.roles}
                    const [access, refresh] = AuthService.createJWTtokens(userData)
                    console.log("refresh")
                    return res.status(200).json({access, refresh})
                }
                catch (e) {
                    return res.status(401).json({message: "Refresh token is expired"})
                }
            }
            res.status(401).json({message: "Access token is invalid"})
        }
    }

    static createJWTtokens(user) {
        const accessToken = this.createJWT(user, lifeTime.ACCESS)
        const refreshToken = this.createJWT(user, lifeTime.REFRESH)
        return [accessToken, refreshToken]
    }

    static createJWT(user, expiresIn) {
        const token = jwt.sign(user, process.env.PRIVATE_KEY, {expiresIn})
        return token
    }

    static getTokenWithValidation(req, res) {
        const bearer = req.headers.authorization
        if (!bearer) {
            res.status(401).json({message: "No authorization header"})
            return ""
        }
        const token = bearer.split(" ")[1]
        if (!token) {
            res.status(401).json({message: "A bearer token is expected"})
            return ""
        }
        return token
    }


}

module.exports = new AuthService()
