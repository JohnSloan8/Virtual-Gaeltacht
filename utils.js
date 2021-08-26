module.exports = {
	
	getWaitingList: chatModel_ => {
		let waitingList = []
		chatModel_.waitingList.forEach(function(wL) {
			waitingList.push(wL)
		})
		return waitingList
	},

	getCurrentParticipants: chatModel_ => {
		let currentParticipants = chatModel_.participants.filter(p => p.endTime === null)
		let currentParticipantsList = []
		currentParticipants.forEach(function(p) {
			currentParticipantsList.push(p.name)
		})
		console.log('currentParticipantsList:', currentParticipantsList)
		return currentParticipantsList
	},

	getLookingAt: (chatModel_, participantList_) => {
		let lookingAt = {}
		participantList_.forEach(function(p) {
			let personLookingAtAll = chatModel_.lookingAt.filter(lA => lA.who === p && participantList_.includes(lA.whom))
			let mRW = [null, false]
			if (personLookingAtAll.length > 0) {
				let mostRecentWhom = personLookingAtAll.pop()
				mRW = [mostRecentWhom.whom, mostRecentWhom.body]
			} else {
				if (participantList_.length > 1) {
					if (participantList_[0] !== p) {
						mRW = [participantList_[0], false]
					} else {
						mRW = [participantList_[1], false]
					}
				}
			}
			lookingAt[p] = mRW
		})
		console.log('lookingAt:', lookingAt)
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
