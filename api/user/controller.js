const user = require('../../models/user')
const Error = require('../../library/error')

exports.findById = async (req, res) => {
	const params = req.params
	const id = params.id
	
	console.log(req.decoded)

	if (id === undefined) {
		res.json(Error.get('INVALID_VALUE'))
		return
	}
	//본인 아이디 검색시
	if (id === req.decoded.id) {

	}

	const result = await user.getConnection(id)
				   .then(user.findById)
				   .catch((error) => {
						res
						.status(409)
						.json(Error.get(error))
					})

					
	const count = result[0].count

	if (count < 1) {
		res.json(Error.get('FOUND_NO_DATA'))
		return
	}

	res.json({
		code: '0000',
		id: id
	})
}