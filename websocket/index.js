const webSocket = require('ws')
const jwtConfig = require('../config/jwt_config')
const token = require('../library/token')
const user = require('../models/user')
const hash = require('../library/hash')
const ChatController = require('./ChatController')

function heartbeat() {
	this.isAlive = true
}

module.exports = (server) => {
	const wss = new webSocket.Server({server})
	console.log('webSocket server open success')

	server.on('upgrade', async (req, socket, head) => {
		const ip = req.headers['x-real-ip']
		const refreshToken = token.get(req)

		//임시
		if (ip === '49.247.19.16') {
			return
		}

		if (!refreshToken || !ip) {
			console.log('refreshToken or ip is undefined : ' + ip)
			socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
			socket.destroy()
			return
		}

		try {
			const decoded = await token.decode(refreshToken, jwtConfig.secretKey)
			const userInfo = await user.getConnection(decoded.no)
							 .then(user.getUserData)
			if (userInfo.length < 1) {
				throw new Error('userInfo is not exist')
			}
			if (userInfo[0].ip !== hash.convert(ip)) {
				throw new Error('ip is not equal')
			}
		} catch(error) {
			console.log(error)
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
			//id 정보 추출을 위한 변수 호출
			const refreshToken = token.get(req)
			const decoded = await token.decode(refreshToken, jwtConfig.secretKey)
			let response = {}

			ws.id = decoded.no
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
				data.name = '다니'
				data.content = msg
			} else {
				data = JSON.parse(msg)
			}

			try {
				switch(data.type) {
					case 'CHAT':
						response = await ChatController(data, ws.id)
						console.log('response=-----')
						console.log(response)
						break;
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
	})

	const interval = setInterval(function ping() {
		wss.clients.forEach(function each(ws) {
			if (ws.isAlive === false) {
				console.log('ws terminate' + ws.id)
				return ws.terminate()
			}
			ws.isAlive = false
			ws.ping(() => {})
		})
	}, 30000)
}
