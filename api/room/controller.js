const room = require('../../models/room')
const Error = require('../../library/error')
const Result = require('../../library/result')

exports.create = async (req, res) => {
	const body = req.body
	const isPrivate = body.isPrivate || 0

	if (isPrivate !== 0 && isPrivate !== 1) {
		res.json(Result.get('9999'))
		return
	}

	try {
		const unixEpoch = Math.floor(new Date().getTime() / 1000)
		const params = [unixEpoch, isPrivate]
		const returnData = await room.getConnection(params)
			.then(room.create)
		const data = { roomNo: returnData.insertId }

		res.json(Result.get('0000', data))
	} catch(error) {
		const message = error.message
		const code = '4000'

		if (message.length === 4) {
			code = message
		} else {
			console.log(error)
		}

		res.json(Result.get(code))
	}
}

exports.find = (req, res) => {
	const params = req.params
	const no = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (no === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(no)
		})
	}

	const checkResponse = (result) => {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				reject('FOUND_NO_DATA')
			}
			resolve(result)
		})
	}

	const respond = (result) => {
		res.json({
			code: '0000',
			data: result
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}
	
	checkValue()
	.then(room.getConnection)
	.then(room.find)
	.then(checkResponse)
	.then(respond)
	.catch(respondError)
}

exports.delete = (req, res) => {
	const params = req.params
	const no = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (no === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(no)
		})
	}

	const respond = (result) => {
		res.json({
			code: '0000',
			data: result.affectedRows
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}
	
	checkValue()
	.then(room.getConnection)
	.then(room.delete)
	.then(respond)
	.catch(respondError)
	
}
