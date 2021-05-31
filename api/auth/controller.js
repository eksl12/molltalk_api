const user = require('../../models/user')
const hash = require('../../library/hash')
const Error = require('../../library/error')
const jwt = require('jsonwebtoken')

exports.register = (req, res) => {
	const body = req.body
	var password = body.password

	const checkValue = (con) => {
		return new Promise((resolve, reject) => {
			if (body.id === undefined || body.password === undefined || body.name === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(body.id)	
		})
	}

	const checkDuplicateUser = (result) => {
		var count = result[0].count

		return new Promise((resolve, reject) => {
			if (count > 0) {
				reject('DUP_VALUE')
			} else {
				const hashPassword = hash.convert(password)
				const params = [ body.id, hashPassword, body.name]
				resolve(params)
			}
		});
	}

	const respond = (result) => {
		res.json({
			code: '0000',
			message: 'create complete'
		})
	}
	
	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error));
	}

	checkValue()
	.then(user.getConnection)
	.then(user.findById)
	.then(checkDuplicateUser)
	.then(user.getConnection)
	.then(user.create)
	.then(respond)	
	.catch(respondError)
}

exports.login = (req, res) => {
	var body = req.body
	var password = body.password

	const checkValue = (con) => {
		return new Promise((resolve, reject) => {
			if (body.id === undefined || body.password === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(body.id)
		})
	}

	const checkUser = (result) => {
		var count = result[0].count

		return new Promise((resolve, reject) => {
			if (count === 0) {
				reject('FOUND_NO_DATA')
			} else {
				const hashPassword = hash.convert(password)
				const params = [ body.id, hashPassword ]
				resolve(params)
			}
		});
	}

	const checkLogin = (userData) => {
		return new Promise((resolve, reject) => {
			if (user.length === 0) {
				reject('PROCESS_FAILURE')
			} else {
				resolve(userData)
			}
		})
	}

	const updateAuthData = (userData) => {
		const unixEpoch = Math.floor(new Date().getTime() / 1000)
		const userNo = userData[0].no

		return new Promise((resolve, reject) => {
			const ip = req.headers['x-real-ip']
			const pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

			if (!ip || !pattern.test(ip)) {
				reject('INVALID_DATA')
			}
			const hashingIp = hash.convert(ip)

			user.getConnection([ unixEpoch, hashingIp, userNo ])
			.then(user.updateAuthData)
			.then((rows) => {
				if (rows.changedRows === 1) {
					resolve(userData)
				} else {
					reject('FOUND_NO_DATA')
				}
			})
			.catch((error) => {
				reject(error)
			})
		})
	}

	const createRefreshToken = (userData) => {
		const p = new Promise((resolve, reject) => {
			jwt.sign(
				{
					no: userData[0].no
				},
				req.app.get('jwt-secret'),
				{
					expiresIn: '1d',
					issuer: 'zodaland.com',
					subject: 'refreshToken'
				}, (err, token) => {
					if (err) {
						reject(Error.get(lang.auth_failure))
					}
					res
					.cookie('token', token, { path: '/', expires: new Date(Date.now() + (360000 * 24)), sameSite: 'none', secure: true, httpOnly: true })
					resolve(userData)
				})
		})
		return p
	}

	const createAccessToken = (userData) => {
		const data = {
				no: userData[0].no,
				id: userData[0].id,
				name: userData[0].name
			}
		const p = new Promise((resolve, reject) => {
			const payLoad = data
			jwt.sign(
				payLoad,
				req.app.get('jwt-secret'),
				{
					expiresIn: '5m',
					issuer: 'zodaland.com',
					subject: 'userinfo'
				}, (err, token) => {
					if (err) {
						reject(Error.get(lang.auth_failure))
					}
					resolve({ data: data,
							  accessToken: token
					})
				}
			)
		})
		return p
	}

	const respond = (result) => {
		console.log(result.data.name + " is login")
		res
		.json({
			code: '0000',
			result
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}

	checkValue()
	.then(user.getConnection)
	.then(user.findById)
	.then(checkUser)
	.then(user.getConnection)
	.then(user.verify)
	.then(checkLogin)
	.then(updateAuthData)
	.then(createRefreshToken)
	.then(createAccessToken)
	.then(respond)
	.catch(respondError)
}

exports.check = (req, res) => {
	let result = {
		data: {
			no: req.decoded.no,
			id: req.decoded.id,
			name: req.decoded.name
		}
	}

	if (req.token) {
		result.accessToken = req.token
	}

	res.json({
		code: '0000',
		result
	})
}

exports.logout = (req, res) => {
	res
	.cookie('token', '', { expires: new Date(Date.now() - (360000)) })
	.json({
		code: '0000'
	})
}