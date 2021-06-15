const jwt = require('jsonwebtoken')
const key = require('../config/jwt_config').secretKey
//토큰 인코드
exports.encode = (data, expire, subject) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			data,
			key,
			{
				expiresIn: expire,
				issuer: 'zodaland.com',
				subject: subject
			}, (err, token) => {
				if (err) {
					reject(err)
				}
				resolve(token)
			}
		)
	})	
}
//토큰 디코드
exports.decode = (token) => {
	return new Promise((resolve, reject) => {
		if (!token) {
			reject({ message: 'no token' })
		}
		jwt.verify(token, key, (error, decoded) => {
			if (error) {
				reject(error)
			}
			resolve(decoded)
		})
	})
}
//refreshToken을 찾은 뒤 리턴
//express : cookies, ws : headers['cookie']
exports.getRefreshToken = (req) => {
	let token = ''
	if (req.cookies !== undefined) {
		token = req.cookies.token
	} else if (typeof req.headers['cookie'] !== 'undefined') {
		const cookies = req.headers['cookie'].split('; ')
		const cookie = cookies.find(e => e.indexOf('token=') === 0)
		token = cookie.split('=')[1]
	}
	return token
}

//accessToken 찾아 리턴
//express : headers['authorization'], ws: req.url
exports.getAccessToken = (req) => {
	let token = ''
	let temp = ''
	const headers = req.headers
	const pattern = /[0-9a-zA-Z-_.]+/

	if (typeof req.headers['upgrade'] !== undefined && req.headers['upgrade'] === 'websocket') {
		temp = req.url.substring(1)
	} else if (typeof req.headers['authorization'] !== 'undefined') {
		temp = req.headers['authorization'].split(' ')[1]
	}

	if (temp !== '') {
		if (pattern.test(temp) && temp.length > 100) {
			token = temp
		}
	}

	return token
}