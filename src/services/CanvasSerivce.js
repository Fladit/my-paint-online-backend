const CanvasSession = require("../models/CanvasSession")
const uuid = require("uuid")

class CanvasService {
    async createCanvasSession(req, res) {
        try {
            let sessionID = req.body.sessionID
            const user = req.current.user
            if (!sessionID)
                return res.status(400).send()
            const isExist = !!await CanvasSession.findOne({sessionID: sessionID})
            if (isExist) {
                sessionID = uuid.v4()
            }
            const canvasSession = new CanvasSession({
                sessionID: sessionID,
                users: [user.id],
                owner: user.id,
            })
            await canvasSession.save()
            return res.status(200).json({sessionID})
        }
        catch (e) {
            return res.status(400).json({message: e.message})
        }
    }
}

module.exports = new CanvasService()
