const roomUser = require('../../../models/room_user')
const room = require('../../../models/room')
const user = require('../../../models/user')
const Error = require('../../../library/error')
const Result = require('../../../library/result')

const checkValidation = (param) => {
	const checkRoom = (result) => {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				console.log('invalid room')
				reject('FOUND_NO_DATA')
			}
			resolve(param[0])
		})
	}

	const checkUser = (count) => {
		return new Promise((resolve,reject) => {
			if (count === 0) {
				console.log('invalid user')
				reject('FOUND_NO_DATA')
			}
			resolve()
		})
	}

	const respond = () => {
		return {
			code: '0000',
			data: param
		}
	}

	const respondError = (error) => {
		return error
	}


	return room.getConnection(param[1])
	.then(room.find)
	.then(checkRoom)
	.then(user.getConnection)
	.then(user.findById)
	.then(checkUser)
	.then(respond)
	.catch(respondError)
}

exports.create = async (req, res) => {
	const body = req.body
	const userId = body.userId || req.decoded.id
	const roomNo = body.roomNo

	if (!userId || !roomNo) {
		console.log(body)
		res.json(Result.get('9999'))
		return
	}

	validResult = await checkValidation([userId, roomNo])

	if (validResult.code !== '0000') {
		res.json(Result.get('9999'))
		return
	}

	try {
		const userNo = await user.getConnection(userId)
			.then(user.getNoById)
		if (!userNo) {
			throw '9999'
		}
		
		const dupParams = [userNo, roomNo]
		const dupRoomCount = await roomUser.getConnection(dupParams)
			.then(roomUser.findDup)

		if (dupRoomCount > 0) {
			throw '9998'
		}

		const unixEpoch = Math.floor(new Date().getTime() / 1000)
		const createParams = [userNo, roomNo, unixEpoch]

		const returnData = await roomUser.getConnection(createParams)
			.then(roomUser.create)

		if (returnData.affectedRows !== 1) {
			throw '9997'
		}

		res.json(Result.get('0000'))
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

exports.findRoom = (req, res) => {
	const params = req.params
	const roomNo = params.roomNo
	const userNo = params.userNo

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (roomNo === undefined || userNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve([ userNo, roomNo ])
		})
	}
/*
	const checkRoom = (result) => {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				reject({
					code: '9997',
					message: 'invalid roomNo'
				})
			}
			resolve(userNo)
		})
	}
*/
	const confirmValidation = (result) => {
		return new Promise((resolve, reject) => {
			if (result.code !== '0000') {
				reject(result)
			}
			resolve(result.data)
		})
	}

	const checkResponse = (result) => {
		return new Promise((resolve,reject) => {
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
	.then(checkValidation)
	.then(confirmValidation)
	.then(roomUser.getConnection)
	.then(roomUser.findRoom)
	.then(checkResponse)
	.then(respond)
	.catch(respondError)
}

exports.findRooms = (req, res) => {
	const params = req.params
	const userNo = params.userNo

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (userNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(userNo)
		})
	}

	const checkResponse = (result) => {
		return new Promise((resolve,reject) => {
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
	.then(roomUser.getConnection)
	.then(roomUser.findRooms)
	.then(checkResponse)
	.then(respond)
	.catch(respondError)
}

exports.delete = (req, res) => {
	const params = req.params
	const userNo = params.userNo
	const roomNo = params.roomNo

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (userNo === undefined || roomNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve([ userNo, roomNo ])
		})
	}

	const checkResponse = (result) => {
		return new Promise((resolve,reject) => {
			if (result.affectedRows < 1) {
				reject('FOUND_NO_DATA')
			}
			resolve(result)
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
	.then(roomUser.getConnection)
	.then(roomUser.delete)
	.then(checkResponse)
	.then(respond)
	.catch(respondError)
}

exports.update = (req, res) => {
	const body = req.body
	const params = req.params
	
	const roomNo = params.roomNo
	const userNo = params.userNo

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (roomNo === undefined || userNo === undefined) {
				reject('INVALID_VALUE')
			}
			
			if (Object.keys(body).length !== 1 || (body.name === undefined && body.exit_date === undefined)) {
				reject('INVALID_VALUE')
			}
			resolve()
		})
	}

	const updateData = () => {
		if (body.name !== undefined) {
			return roomUser.getConnection([ body.name, userNo, roomNo ])
					.then(roomUser.updateName)
		} else {
			return roomUser.getConnection([ body.exit_date, userNo, roomNo ])
					.then(roomUser.updateExitDate)
		}
	}

	const checkResponse = (result) => {
		return new Promise((resolve, reject) => {
			if (result.affectedRows < 1) {
				reject('NOT_EXIST_SUCCEEDED_DATA')
			}
			resolve(result.affectedRows)
		})
	}

	const respond = (result) => {
		res.json({
			code : '0000',
			data : result
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}

	checkValue()
	.then(updateData)
	.then(checkResponse)
	.then(respond)
	.catch(respondError)
}