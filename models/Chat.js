const mongoose = require('mongoose')
const ChatSchema = new mongoose.Schema({
	chatURL: String,
	createdBy: String,
	startDate: {
		type: Date,
		default: Date.now
	},
	participants: [{
		name: String,
		startTime: {
			type: Date, 
			default: Date.now
		}, 
		endTime: Date
	}],
	lookingAt: [{
		who: String,
		whom: String,
		timestamp: {
			type: Date
		}
	}],
	expressions: [{
		who: String,
		expression: String,
		timestamp: {
			type: Date
		}
	}],
	gestures: [{
		who: String,
		gesture: String,
		timestamp: {
			type: Date
		}
	}]
})

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat
