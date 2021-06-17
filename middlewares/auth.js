const jwt = require('jsonwebtoken')
const token = require('../library/token')
const user = require('../models/user')
const Result = require('../library/result')
const hash = require('../library/hash')
const Util = require('../library/util')
/*
const authMiddleware = async (req) => {
	const refreshToken = token.getRefreshToken(req)
	const ip = req.headers['x-real-ip']
	let accessToken = token.getAccessToken(req)
console.log(accessToken)
	if (!refreshToken || !ip) {
		return
	}
	//accessToken이 있다면 accessToken 반환
	//없고 refreshToken이있다면 accessToken재발급후 반환
	try {
		const decrypt = await token.decode(refreshToken)
		const data = await user.getConnection(decrypt.no)
						 .then(user.getUserData)

		const userData = JSON.parse(JSON.stringify(data[0]))

		if (userData.ip !== hash.convert(ip)) {
			throw new Error('9703')
		}

		if (accessToken === '') {
			const payLoad = {
				id: userData.id,
				name: userData.name
			}

			accessToken = await token.encode(payLoad, '2000ms', 'userinfo')

			req.token = accessToken
		}
		try {
			req.decoded = await token.decode(accessToken)
		} catch(error) {
			//만료된 경우 재발급 처리
			if (error.message === 'jwt expired') {
				accessToken = await token.encode(userData, '2000ms', 'userinfo')
				req.token = accessToken
				req.decoded = await token.decode(accessToken)
			}
		}
	} catch(error) {
		console.log(error)
		
		return
	}
	return
}

module.exports = authMiddleware
*/
module.exports = (() => {
	const getDecodedAccessTokenData = async (req) => {
		const accessToken = token.getAccessToken(req)

		try {
			const decrypt = await token.decode(accessToken)

			return Result.get('0000', decrypt)
		} catch (error) {
			const message = error.message
			let code = '4000'

			if (message === 'jwt expired') {
				code = '9705'
			} else if (message === 'no token') {
				code = '9704'
			} else {
				console.log(error)
			}

			return Result.get(code)
		}
	}

	const reIssueToken = async (no) => {
		try {
			const userInfo = await user.getConnection(no)
				.then(user.getUserInfo)

			const accessToken = await token.encode(userInfo, '2000ms', 'userInfo')

			const data = {
				accessToken: accessToken,
				...userInfo
			}

			return Result.get('0000', data)
		} catch (error) {
			const message = error.message
			const code = '4000'

			if (message.length === 4) {
				code = message
			} else {
				console.log(error)
			}

			return Result.get(code)
		}
	}

	const checkRefreshToken = async (req) => {
		const refreshToken = token.getRefreshToken(req)
		const ip = req.headers['x-real-ip']

		if (!refreshToken) {
			return Result.get('9700')
		}
		if (!ip) {
			return Result.get('9701')
		}

		try {
			const decrypt = await token.decode(refreshToken)
			const hashedIp = await user.getConnection(decrypt.no)
							 .then(user.getIpByNo)
			if (!hashedIp) {
				throw new Error('9701')
			}
			if (hashedIp !== hash.convert(ip)) {
				throw new Error('9702')
			}

			const data = {
				no: decrypt.no
			}
			return Result.get('0000', data)
		} catch(error) {
			const message = error.message
			let code = '4000'

			if (message === 'jwt expired') {
				code = '9703'
			} else if (message.length === 4) {
				code = message
			} else {
				console.log(error)
			}
			return Result.get(code)
		}
	}

	return {
		getDecodedAccessTokenData,
		reIssueToken,
		checkRefreshToken
	}
})()