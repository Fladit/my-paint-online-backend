const jwt = require("jsonwebtoken")

function authentication(req, res, next) {
    const bearerToken = req.headers.authorization
    //console.log(bearerToken, req.body)
    if (!bearerToken)
        return res.status(400).json("Authorization token is empty")
    const token = bearerToken.split(" ")[1]
    if (!token)
        return res.status(400).json("Authorization token is empty")
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
        req.current = {user: decoded}
        next()
    }
    catch (e) {
        console.log(e.message)
        return res.status(401).json(e)
    }
}

module.exports = authentication

