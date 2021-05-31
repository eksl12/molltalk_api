const jwt = require('jsonwebtoken')
const token = require('../library/token')
const user = require('../models/user')
const Error = require('../library/error')
const hash = require('../library/hash')

const authMiddleware = async (req, res, next) => {
	const refreshToken = token.get(req)
	const authorization = req.headers['authorization']
	const ip = req.headers['x-real-ip']
	let accessToken = authorization ? authorization.split(' ')[1] : ''

	//preflight시 메소드 OPTIONS 으로 들어오고 에러 처리돼서 예외처리
	if (req.method === 'OPTIONS') {
		return res.json()
	}

	if (!refreshToken || !ip) {
		return res.json({
			code: 9999,
			message: 'not exist auth data'
		})
	}
	//accessToken이 있다면 accessToken 반환
	//없고 refreshToken이있다면 accessToken재발급후 반환

	try {
		if (!accessToken) {
			const decrypt = await token.decode(refreshToken, req.app.get('jwt-secret'))
			const userData = await user.getConnection(decrypt.no)
							 .then(user.getUserData)
			if (userData[0].ip !== hash.convert(ip)) {
				throw new Error('AUTHENTICATION_FAILURE')
			}

			accessToken = await new Promise((resolve, reject) => {
				jwt.sign(
					{
						no: userData[0].no,
						id: userData[0].id,
						name: userData[0].name
					},
					req.app.get('jwt-secret'),
					{
						expiresIn: '5m',
						issuer: 'zodaland.com',
						subject: 'userinfo'
					}, (err, token) => {
						if (err) {
							reject(Error.get())
						}
						resolve(token)
					}
				)
			})

			req.token = accessToken
			console.log(accessToken)
		}
	} catch(error) {
		return res.status(403).json(Error.get(error))
	}

	const p = token.decode(accessToken, req.app.get('jwt-secret'))

	const onError = (error) => {
		res.status(403).json({
			code: 9998,
			message: error.message
		})
	}

	p.then((decoded) => {
		console.log(decoded.id + ' is passed auth\nreq.token : ' + req.token)
		req.decoded = decoded
		next()
	})
	.catch(onError)
}

module.exports = authMiddleware
