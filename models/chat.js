const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	roomNo: { type: Number },
	userNo: { type: Number },
	name: { type: String },
	content: { type: String, required: true }
	},
	{
		timestamps: true
	})

chatSchema.statics.create = function(payload) {
	const chat = new this(payload)

	return chat.save()
}

chatSchema.statics.finds = function() {
	return this.find({}, { _id: false, name: true, content: true }).sort({_id: -1}).limit(50)
}

module.exports = mongoose.model('Chat', chatSchema)