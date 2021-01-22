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
                this.messageBroadcasting(sessionID, ws, message)
                break;
            }

            default: {
                ws.close(1008)
                break;
            }


        }
    }

    messageBroadcasting(sessionID, ws, message) {
        if (this.clients[sessionID].length > 1) {
            this.clients[sessionID].forEach(client => {
                //console.log(client !== ws)
                if (client !== ws)
                {
                    //console.log("message is sent")
                    client.send(JSON.stringify(message))
                }
            })
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
        const {points, lineWidth, strokeStyle} = parameters
        const startPoint = points[0]
        console.log("start")
        canvas.beginPath()
        canvas.moveTo(startPoint.x, startPoint.y)
        canvas.lineWidth = lineWidth
        canvas.strokeStyle = strokeStyle
        for (let i = 1; i < points.length; i++) {
            const point = points[i]
            canvas.lineTo(point.x, point.y)
            canvas.stroke()
        }
    }

    static drawLine(canvas, parameters) {
        const {x1, y1, x2, y2, strokeStyle, lineWidth} = parameters
        canvas.beginPath()
        canvas.moveTo(x1, y1)
        canvas.strokeStyle = strokeStyle
        canvas.lineWidth = lineWidth
        canvas.lineTo(x2, y2)
        canvas.stroke()
    }

    static drawCircle(canvas, parameters) {
        const {x, y, w, h, fillStyle} = parameters
        canvas.beginPath()
        canvas.arc(x, y, Math.sqrt((w*w + h*h)), 0, 2* Math.PI, false)
        canvas.fillStyle = fillStyle
        canvas.fill()
    }

    static drawRectangle(canvas, parameters) {
        const {x, y, w, h, fillStyle} = parameters
        canvas.beginPath()
        canvas.fillStyle = fillStyle
        canvas.rect(x, y, w, h)
        canvas.fill()
    }
}

module.exports = new DrawSocketService()
