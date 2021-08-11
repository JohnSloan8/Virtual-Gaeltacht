const express = require('express')
const router = express.Router()
const {ensureAuthenticated, loggedIn} = require('../config/auth')
const path = require('path')
const randomWords = require('random-words')
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Models
const User = require('../models/User')
const Chat = require('../models/Chat')

router.get('/', (req, res) => {
	res.render('welcome', {
		loggedIn: loggedIn(req)
	})
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	let u = await User.findOne({email: req.user.email}).exec()
	if (u.avatarURL !== null) {
		avatarURL = req.user.name + '_' + path.basename(u.avatarURL)
	} else {
		avatarURL = null
	}
	res.render('dashboard', {
		loggedIn: loggedIn(req),
		name: req.user.name,
		//avatarURL: avatarURL
	})
})

router.post('/createChat', ensureAuthenticated, (req, res) => {

	// create reandom 3-word string with hyphens for url
	const generateUniqueRandomThreeWordURL = async () => {
		let randomURL = randomWords({ exactly: 3, join: '-' })
		let nameExists = await Chat.exists({chatURL: randomURL})
		if ( nameExists ) {
			generateUniqueRandomThreeWordURL();
		} else {
			createChat(randomURL)
		}
	}

	const createChat = randomURL => {
		const newChat = new Chat({
			chatURL: randomURL,
			createdBy: req.user.name,
			host: req.user.name,
			lookingAt: [],
			participants: []
		})
		newChat.save()
			.then(user => {
				//req.flash('success_msg', 'You are now registered and can log in')
				res.redirect('/chat/' + randomURL)
			})
			.catch(err => console.log(err))
	}

	generateUniqueRandomThreeWordURL();

})

router.post('/joinChat', /*ensureAuthenticated,*/ (req, res) => {

	const {url} = req.body;
	res.redirect('/chat/' + url)

})

router.get('/chat/:id', /*ensureAuthenticated,*/ async (req, res) => {
	//let uname = "l"
	let uname = req.user.name
	let c = await Chat.findOne({chatURL: req.params.id})
	if (c) {
		let firstEnter = false
		currentParticipants = c.participants.filter(p => p.endTime === null )
		let thisParticipant = c.participants.find(p => p.name === uname && p.endTime === null)
		if (thisParticipant === undefined) {
			if (uname === c.createdBy && c.participants.length === 0) {
				c.participants.push({
					name: uname,
					endTime: null
				})
				c.save();
			}
			firstEnter = true
		}

		participantNames = []
		participantLookingAt = []
		c.participants.forEach(function (p) {
			let personLookingAtAll = c.lookingAt.filter(lA => lA.who === p.name)
			let mostRecentWhom = null
			if (personLookingAtAll.length > 0) {
				mostRecentWhom = personLookingAtAll.pop().whom
			}
			participantNames.push(p.name)
			participantLookingAt.push(mostRecentWhom)
		})

		console.log('participantNames:', participantNames)
		res.render('chat', {
			loggedIn: loggedIn(req),
			name: uname,
			participantNames: participantNames,
			participantLookingAt: participantLookingAt,
			host: c.host,
			firstEnter: firstEnter
		})
	} else {
		req.flash('error_msg', `the conversation ${req.params.id} does not exist`)
		res.redirect('/dashboard')
	}
})

var c
wss.on('connection', function connection(ws) {

  ws.on('message', async function incoming(message) {
		let data = JSON.parse(message)
		console.log('message: ', message)
		if ( data.newConnection ) {
			c = await Chat.findOne({chatURL: path.basename(data.chatURL)})
			let waitingListArray = createWaitingListArray(c)
			if (c.host === data.name) {
				data['waitingList'] = waitingListArray
				ws.send(JSON.stringify(data))
			} else {
				ws.send(message)
			}
		} else if ( data.requestEnter ) {
			if (!c.waitingList.some(n => n.name === data.who)) {
				c.waitingList.push({name: data.who})
				c.save()
			}
			data['waitingListArray'] = createWaitingListArray(c)
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(data));
				}
			});
		} else if ( data.admitRefuse === true ) {
			let newParticipant = c.waitingList.shift()
			if (data.admit) {
				c.participants.push({
					name: newParticipant.name,
					endTime: null
				})
			}
			c.save()
			console.log('after shift:', c.waitingList)
			data['waitingListArray'] = createWaitingListArray(c)
			data['newParticipant'] = newParticipant.name
			wss.clients.forEach(function each(client) {
				if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(data));
				}
			});
		} else if ( data.newParticipant === true ) {
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(message);
				}
			});
		} else if ( data.removeParticipant === true ) {
			let p = c.participants.find(e => e.name === data.who)
			p.endTime = Date.now()
			c.save()
			ws.close()
			let currentParticipants = c.participants.filter(p => p.endTime === null )
			if (currentParticipants.length > 0) {
				c.host = currentParticipants[0].name
			}
			c.save()
			let participantNames = ""
			currentParticipants.forEach(function(p) {
				participantNames += p.name + ","
			})
			participantNames = participantNames.slice(0, participantNames.length - 1)
			data['participantNames'] = participantNames
			data['host'] = c.host
			wss.clients.forEach(function each(client) {
				if ( client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(data));
				}
			});
		} else {
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(message);
				}
			});
			if (data.type === "look") {
				c.lookingAt.push({
					who: data.who,
					whom: data.whom,
					timestamp: new Date(data.timestamp)
				})
				c.save();
			} else if (data.type === "expression") {
				c.expressions.push({
					who: data.who,
					expression: data.expression,
					timestamp: new Date(data.timestamp)
				})
				c.save();
			} else if (data.type === "gesture") {
				c.gestures.push({
					who: data.who,
					gesture: data.gesture,
					timestamp: new Date(data.timestamp)
				})
				c.save();
			} else if (data.type === "nodShake") {
				c.nodShakes.push({
					who: data.who,
					nodShake: data.nodShake,
					timestamp: new Date(data.timestamp)
				})
				c.save();
			}
		}
	});

});

function createWaitingListArray(c) {
	let waitingListArray = []
	c.waitingList.forEach(function(p) {
		waitingListArray.push(p.name)
	})
	return waitingListArray
}

module.exports = router
