const {createCanvas} = require("canvas")
const width = 900
const height = 600
const CanvasSession = require("../models/CanvasSession")

class DrawSocketService {
    clients = {}
    canvases = {}
    async onOpenEvent(sessionID, token, ws) {
        console.log("open event", token)
        //Закрывать сокет, если не вложили токен
        if (!token)
            ws.close()
        if (this.clients.hasOwnProperty(sessionID)) {
            this.clients[sessionID].push(ws)
        }
        else {
            //console.log("else")
            /*
            this.clients[sessionID] = [ws]
            this.canvases[sessionID] = createCanvas(width, height)

             */
            try {
                //console.log("canvas session search")
                const canvasSession = await CanvasSession.findOne({sessionID: sessionID})
                if (canvasSession)
                    this.setCanvasSession(canvasSession, sessionID, ws)
                else ws.close(1008, `Canvas Session ${sessionID} is not exist!`)
            }
            catch (err) {
                console.log("catch", err)
                ws.close(1008, err.message)
            }


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
                this.sendCurrentImage(sessionID, ws)
                break;
            }
            case "closeConnection": {
                break;
            }

            case "drawEvent": {
                CanvasDraw.drawHandler(this.canvases[sessionID], message)
                this.messageBroadcasting(sessionID, ws, message)
                CanvasSession.findOneAndUpdate({sessionID: sessionID}, {image64: this.canvases[sessionID].toDataURL()})
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

    setCanvasSession(session, sessionID, ws) {
        if (session) {
            this.clients[sessionID] = [ws]
            if (session.image64) {
                const canvas = createCanvas(width, height)
                const img = new Image()
                img.src = session.image64
                img.onload = () => {
                    canvas.getContext("2d").drawImage(img, 0, 0, width, height)
                    this.canvases[sessionID] = canvas
                }
            }
            else this.canvases[sessionID] = createCanvas(width, height)
        }
    }
    sendCurrentImage(sessionID, ws) {
        ws.send(JSON.stringify({
            method: "setStartImage",
            image: this.canvases[sessionID].toDataURL()
        }))
    }

}

class CanvasDraw {

    static drawHandler(canvas, message) {
        switch (message.figure) {
            case "brush": {
                this.drawBrush(canvas.getContext("2d"), message.parameters)
                break;
            }

            case "line": {
                this.drawLine(canvas.getContext("2d"), message.parameters)
                break;
            }

            case "circle": {
                this.drawCircle(canvas.getContext("2d"), message.parameters)
                break;
            }

            case "rectangle": {
                this.drawRectangle(canvas.getContext("2d"), message.parameters)
                break;
            }

            default:
                break;
        }
    }

    static drawBrush(canvasContext, parameters) {
        const {points, lineWidth, strokeStyle} = parameters
        const startPoint = points[0]
        canvasContext.beginPath()
        canvasContext.moveTo(startPoint.x, startPoint.y)
        canvasContext.lineWidth = lineWidth
        canvasContext.strokeStyle = strokeStyle
        for (let i = 1; i < points.length; i++) {
            const point = points[i]
            canvasContext.lineTo(point.x, point.y)
            canvasContext.stroke()
        }
    }

    static drawLine(canvasContext, parameters) {
        const {x1, y1, x2, y2, strokeStyle, lineWidth} = parameters
        canvasContext.beginPath()
        canvasContext.moveTo(x1, y1)
        canvasContext.strokeStyle = strokeStyle
        canvasContext.lineWidth = lineWidth
        canvasContext.lineTo(x2, y2)
        canvasContext.stroke()
    }

    static drawCircle(canvasContext, parameters) {
        const {x, y, w, h, fillStyle} = parameters
        canvasContext.beginPath()
        canvasContext.arc(x, y, Math.sqrt((w*w + h*h)), 0, 2* Math.PI, false)
        canvasContext.fillStyle = fillStyle
        canvasContext.fill()
    }

    static drawRectangle(canvasContext, parameters) {
        const {x, y, w, h, fillStyle} = parameters
        canvasContext.beginPath()
        canvasContext.fillStyle = fillStyle
        canvasContext.rect(x, y, w, h)
        canvasContext.fill()
    }
}

module.exports = new DrawSocketService()
