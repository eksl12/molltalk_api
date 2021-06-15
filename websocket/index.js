const webSocket = require('ws')
const token = require('../library/token')
const user = require('../models/user')
const hash = require('../library/hash')
const ChatController = require('./ChatController')
const Auth = require('../middlewares/auth')

function heartbeat() {
	console.log(this.id + ' heartbeat')
    this.isAlive = true
}

module.exports = (server) => {
    const wss = new webSocket.Server({server})
    console.log('webSocket server open success')

    server.on('upgrade', async (req, socket, head) => {
        //임시
        if (req.headers['x-real-ip'] === '49.247.19.16') {
            return
        }

		const refreshTokenResult = await Auth.checkRefreshToken(req)

		if (refreshTokenResult.code !== '0000') {
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
			socket.destroy()
			return
		}

    })

    wss.on('connection', async (ws, req) => {
        //임시
        if (req.headers['x-real-ip'] === '49.247.19.16') {
            ws.id = 9999
        } else {
			const refreshTokenResult = await Auth.checkRefreshToken(req)

			if (refreshTokenResult.code !== '0000') {
				ws.terminate()
				return
			}

			ws.id = refreshTokenResult.no
		
        }

        ws.isAlive = true
        console.log(ws.id + ' is connected')
        


        //접속 유지
        ws.on('pong', heartbeat)

        ws.on('message', async (msg) => {
            let data = {}
            let response = {}

            //임시
            if(ws.id == 9999) {
                data.type = 'CHAT'
                data.command = 'send'
                data.name = ''
                data.content = msg
            } else {
                data = JSON.parse(msg)
            }
            try {
                switch(data.type) {
                    case 'CHAT':
                        response = await ChatController(data, ws.id)
                        break;
					case 'PING':
						console.log('ping request')
						ws.ping(() => {})
                    default:
                        break;
                }
            } catch(error) {
                console.log(error)
            }
/*
            if (Object.keys(response).length === 0) {
                return
            }
*/
            wss.clients.forEach((client) => {
                if (Object.keys(response).length !== 0) {
                        client.send(JSON.stringify(response))
                }
            })
        })

		ws.on('close', (code) => {
			console.log(ws.id + ' has been closed')
			ws.terminate()
		})

		ws.on('error', (error) => {
			console.log(ws.id + ' error occurs')
			console.log(error)
			ws.terminate()
		})
    })

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                console.log('ws terminate' + ws.id)
                ws.terminate()
            }
            ws.isAlive = false
        })
    }, 1000)
}
