const room = require('../../models/room')
const Error = require('../../library/error')

exports.create = (req, res) => {
	const body = req.body

	const isPrivate = body.isPrivate || 0
	console.log(isPrivate)
	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (isPrivate !== 0 && isPrivate !== 1) {
				console.log('asd')
				reject('INVALID_VALUE')
			}
			resolve(isPrivate)
		})
	}

	const respond = (result) => {
		res.json({
			code: '0000',
			data: result.insertId
		})
	}

	const respondError = (error) => {
		res
		.status(409)
		.json(Error.get(error))
	}
	
	checkValue()
	.then(room.getConnection)
	.then(room.create)
	.then(respond)
	.catch(respondError)
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
