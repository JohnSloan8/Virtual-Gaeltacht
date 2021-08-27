const mongoose = require('mongoose')
const ChatSchema = new mongoose.Schema({
	chatURL: String,
	createdBy: String,
	startDate: {
		type: Date,
		default: Date.now
	},
	endDate: {
		type: Date,
		default: null
	},
	participants: [{
		name: String,
		startTime: {
			type: Date, 
			default: Date.now
		}, 
		endTime: Date
	}],
	waitingList: [{
		name: String,
		requirer0: String,
		requirer1: String,
		requestTime: {
			type: Date, 
			default: Date.now
		} 
	}],
	lookingAt: [{
		who: String,
		whom: String,
		body: Boolean,
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
	}],
	nodShakes: [{
		who: String,
		nodShake: String,
		timestamp: {
			type: Date
		}
	}]
})

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat
