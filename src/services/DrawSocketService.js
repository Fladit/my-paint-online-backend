const {createCanvas} = require("canvas")
const width = 900
const height = 600

class DrawSocketService {
    clients = {}
    canvases = {}
    onOpenEvent(sessionID, ws) {
        console.log("open event")
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
        message = JSON.parse(message)
        console.log(message.method)
        switch (message.method) {
            case "startConnection": {
                delete message.authorization
                this.messageBroadcasting(sessionID, ws, message)
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

    messageBroadcasting(sessionID, ws, message) {
        console.log("point")
        console.log(this.clients[sessionID])
        this.clients[sessionID].forEach(client => {
            console.log(client !== ws)
            if (client !== ws)
            {
                console.log("message is sent")
                client.send(JSON.stringify(message))
            }
        })

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
