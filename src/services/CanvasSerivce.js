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
            console.log(`Session ${sessionID} was created`)
            return res.status(200).json({sessionID})
        }
        catch (e) {
            return res.status(400).json({message: e.message})
        }
    }

    async getSession(req, res) {
        const sessionID = req.params.id
        const session = await CanvasSession.findOne({sessionID})
        if (session) {
            return res.status(200).json({sessionID:session.sessionID});
        }
        res.status(404).send()
    }
}

module.exports = new CanvasService()
