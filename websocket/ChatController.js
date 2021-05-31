const Chat = require('../models/chat')

const ChatController = (data, no) => {
	const command = data.command
	let response = {
		type: 'CHAT'
	}
	switch(command) {
		case 'join':
				return Chat.finds()
				.then((result) => {
					response.command = 'join'
					response.content = result.reverse()

					return response
				})

			break
		case 'send':
				const chat = {
					name: data.name,
					content: data.content
				}
				return Chat.create(chat)
				.then((result) => {
					response.command = 'send'
					response.name = data.name
					response.content = data.content
					response.length = data.length

					return response
				})
			break
		case 'more':

			break
		default:
			break
	}

	return response
}

module.exports = ChatController