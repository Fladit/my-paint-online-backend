const {createCanvas} = require("canvas")
const width = 900
const height = 600

class DrawSocketService {
    clients = {}
    canvases = {}
    onOpenEvent(sessionID, ws) {
        if (this.clients.hasOwnProperty(sessionID)) {
            this.clients[sessionID].push(ws)
        }
        else {
            this.clients[sessionID] = [ws]
            this.canvases[sessionID] = createCanvas(width, height)
        }
    }

    onCloseEvent(sessionID, ws) {
        const wsIndex = this.clients[sessionID].indexOf(ws)
        this.clients[sessionID].splice(wsIndex, 1)
    }

    onMessageEvent(sessionID, ws, message) {
        for (const client in this.clients) {
            if (client !== ws)
                client.send(message)
        }
    }

}

module.exports = new DrawSocketService()
