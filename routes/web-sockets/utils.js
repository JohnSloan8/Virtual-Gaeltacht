module.exports = {
	
	getWaitingList: chatModel_ => {
		let waitingList = []
		chatModel_.waitingList.forEach(function(p) {
			waitingList.push(p.name)
		})
		return waitingList
	},

	getCurrentParticipants: chatModel_ => {
		let currentParticipants = chatModel_.participants.filter(p => p.endTime === null)
		let currentParticipantsList = []
		currentParticipants.forEach(function(p) {
			currentParticipantsList.push(p.name)
		})
		return currentParticipantsList
	},

	getLookingAt: (chatModel_, participantList_) => {
		let lookingAt = {}
		participantList_.forEach(function(p) {
			let personLookingAtAll = chatModel_.lookingAt.filter(lA => lA.who === p)
			let mostRecentWhom = null
			if (personLookingAtAll.length > 0) {
				mostRecentWhom = personLookingAtAll.pop().whom
			}
			lookingAt[p] = mostRecentWhom
		})
		return lookingAt
	},

	addParticipantToChatModel: (chatModel_, who_) => {
		chatModel_.participants.push({
			name: who_,
			endTime: null
		})
		chatModel_.save();
	}

}
