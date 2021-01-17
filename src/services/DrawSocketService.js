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
        switch (message.method) {
            case "startConnection": {
                delete message.token
                this.messageBroadcasting(ws, message)
                break;
            }
            case "closeConnection": {
                break;
            }

            case "drawEvent": {
                CanvasDraw.drawHandler(this.canvases[sessionID], message)
                break;
            }

            default: {
                ws.close(1008)
                break;
            }


        }
    }

    messageBroadcasting(ws, message) {
        for (const client in this.clients) {
            if (client !== ws)
                client.send(message)
        }
    }

}

class CanvasDraw {

    static drawHandler(canvas, message) {
        switch (message.figure) {
            case "brush": {
                this.drawBrush(canvas, message.parameters)
                break;
            }

            case "line": {
                this.drawLine(canvas, message.parameters)
                break;
            }

            case "circle": {
                this.drawCircle(canvas, message.parameters)
                break;
            }

            case "rectangle": {
                this.drawRectangle(canvas, message.parameters)
                break;
            }

            default:
                break;
        }
    }

    static drawBrush(canvas, parameters) {

    }

    static drawLine(canvas, parameters) {

    }

    static drawCircle(canvas, parameters) {

    }

    static drawRectangle(canvas, parameters) {

    }
}

module.exports = new DrawSocketService()
