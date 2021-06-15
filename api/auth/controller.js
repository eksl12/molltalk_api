const user = require('../../models/user')
const hash = require('../../library/hash')
const Error = require('../../library/error')
const token = require('../../library/token')
const jwt = require('jsonwebtoken')
const util = require('../../library/util')

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
			if (userData.length === 0) {
				reject('PROCESS_FAILURE')
			} else {
				resolve(userData[0].no)
			}
		})
	}

	const updateAuthData = (userNo) => {
		const unixEpoch = Math.floor(new Date().getTime() / 1000)

		return new Promise((resolve, reject) => {
			const ip = req.headers['x-real-ip']

			if (!util.checkValidIp(ip)) {
				reject('INVALID_DATA')
			}
			const hashingIp = hash.convert(ip)

			user.getConnection([ unixEpoch, hashingIp, userNo ])
			.then(user.updateAuthData)
			.then((rows) => {
				if (rows.changedRows === 1) {
					resolve(userNo)
				} else {
					reject('FOUND_NO_DATA')
				}
			})
			.catch((error) => {
				reject(error)
			})
		})
	}

	const createRefreshToken = (userNo) => {
		const payLoad = { no : userNo }
		const p = token.encode(payLoad, '1d', 'refreshToken')

		return p
	}

	const respond = (token) => {
		const refreshToken = token
		res
		.cookie('token', refreshToken, { path: '/', expires: new Date(Date.now() + (1000 * 60 * 60 * 24)), sameSite: 'none', secure: true, httpOnly: true })
		.json({
			code: '0000'
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
	.then(respond)
	.catch(respondError)
}

exports.check = (req, res) => {
	let result = {
		data: {
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
