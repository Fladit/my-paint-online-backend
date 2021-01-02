const {validationResult} = require("express-validator")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Role = require("../models/Role")

class AuthService {
    //Добавить проверку на наличие уже зарегистрированного аккаунта с таким именем
    async registratiion(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.send(errors.array())
        }
        try {
            const username = req.body.username
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

            res.send({
                username: user.username,
                roles: user.roles,
            })
        }
        catch (e) {
            res.send(e.message)
        }

    }

    async authorization(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.send(errors.array())
        }
    }
}
