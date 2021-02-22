const jwt = require("jsonwebtoken")

function authentication(req, res, next) {
    const bearerToken = req.headers.authorization
    if (!bearerToken)
        return res.status(401).json("Authorization token is empty")
    const token = bearerToken.split(" ")[1]
    if (!token)
        return res.status(401).json("Authorization token is empty")
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

function socketAuthentication(ws, req) {
    const token = req.query.token
    if (!token)
        return ws.close("Authorization token is empty")
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
        req.current = {user: decoded}
    }
    catch (e) {
        console.log(e.message)
        return ws.close(e.message)
    }

}


module.exports = {authentication, socketAuthentication}

