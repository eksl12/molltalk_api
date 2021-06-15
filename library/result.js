const message = require('./message')

const Result = {
	get :(code, data) => {
		const addedData = data || {}
		let returnData = {
			code: code,
			message: message.get(code),
			...addedData
		}
		
		return returnData
	}
}

module.exports = Result