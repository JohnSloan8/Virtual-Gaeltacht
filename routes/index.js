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
	console.log('u: ', u.avatarURL)
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
			lookingAt: []
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
		let thisParticipant = c.participants.find(p => p.name === uname )
		if (thisParticipant === undefined || thisParticipant.endTime !== null) {
			c.participants.push({
				name: uname,
				endTime: null
			})
			c.save();
		}

		res.render('chat', {
			loggedIn: loggedIn(req),
			name: uname,
			participantNames: c.participants.map(({ name }) => name)
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
		if ( data.newConnection ) {
			console.log('new connection')
			c = await Chat.findOne({chatURL: path.basename(data.chatURL)})
		} else {
			wss.clients.forEach(function each(client) {
				if (client !== ws && client.readyState === WebSocket.OPEN) {
					client.send(message);
				}
			});
			c.lookingAt.push({
				who: data.who,
				whom: data.whom,
				timestamp: new Date(data.timestamp)
			})
			c.save();
			console.log('lookingAt updated')
		}
	});

});



module.exports = router
