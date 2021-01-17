import * as jwt from "jsonwebtoken";

function authentication(req, res, next) {
    const bearerToken = req.headers.authorization
    if (!bearerToken)
        res.status(400).json("Authorization token is empty")
    const token = bearerToken.split(" ")[1]
    if (!token)
        res.status(400).json("Authorization token is empty")
    try {
        const decodedUser = jwt.verify(token, process.env.PRIVATE_KEY)
        next()
    }
    catch (e) {
        console.log(e.message)
        res.status(401).json(e)
    }
}

