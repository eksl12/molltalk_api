const invitation = require('../../models/invitation')
const room = require('../../models/room')
const user = require('../../models/user')
const Error = require('../../library/error')

exports.create = (req, res) => {
	const body = req.body
	const inviteUserNo = body.inviteUserNo || req.decoded.no
//여기부터
	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (body.roomNo === undefined) {
				reject('INVALID_VALUE')
			}
			
			if (inviteUserNo === undefined) {
				reject('INVALID_VALUE')
			}
			if (body.invitedUserId === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(body.roomNo)
		})
	}

	const checkRoom = (result) => {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				reject('FOUND_NO_DATA')
			}
			resolve(inviteUserNo)
		})
	}

	const checkUser = (result) => {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				reject('FOUND_NO_DATA')
			}
			resolve(body.invitedUserId)
		})
	}

	const getUserNo = (no) => {
		return new Promise((resolve, reject) => {
			const invitedUserNo = no
			if (!invitedUserNo) {
				reject('FOUND_NO_DATA')
			}
			resolve([ body.roomNo, inviteUserNo, invitedUserNo ])
		})
	}

	const respond = (result) => {
		res
		.json({
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
	.then(room.find)
	.then(checkRoom)
	.then(user.getConnection)
	.then(user.findByNo)
	.then(checkUser)
	.then(user.getConnection)
	.then(user.getNoById)
	.then(getUserNo)
	.then(invitation.getConnection)
	.then(invitation.create)
	.then(respond)
	.catch(respondError)
}

exports.findByInviteUser = (req, res) => {
	const params = req.params
	const inviteUserNo = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (inviteUserNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(inviteUserNo)
		})
	}

	const respond = (result) => {
		res
		.json({
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
	.then(invitation.getConnection)
	.then(invitation.findByInviteUser)
	.then(respond)
	.catch(respondError)
}

exports.findByInvitedUser = (req, res) => {
	const params = req.params
	const invitedUserNo = params.no

	const checkValue = () => {
		return new Promise((resolve, reject) => {
			if (invitedUserNo === undefined) {
				reject('INVALID_VALUE')
			}
			resolve(invitedUserNo)
		})
	}

	const respond = (result) => {
		res
		.json({
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
	.then(invitation.getConnection)
	.then(invitation.findByInvitedUser)
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
	.then(invitation.getConnection)
	.then(invitation.delete)
	.then(respond)
	.catch(respondError)
	
}
