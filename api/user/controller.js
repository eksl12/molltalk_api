const user = require('../../models/user')
const Error = require('../../library/error')
const Result = require('../../library/result')

exports.findUser = async (req, res) => {
	const params = req.params
	const id = params.id
	
	try {
		if (id === undefined || id === req.decoded.id) {
			res.json(Result.get('9999'))
			return
		}
		const count = await user.getConnection(id)
					   .then(user.findById)

		const data = {}

		if (count > 0) {
			data.id = id
		}

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