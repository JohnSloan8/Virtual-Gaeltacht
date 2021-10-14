const express = require('express')
const router = express.Router()
const {ensureAuthenticated, ensureNotAuthenticated, loggedIn, isInvited} = require('../config/auth')
const path = require('path')
const randomWords = require('random-words')

// Models
const User = require('../models/User')
const Chat = require('../models/Chat')

router.get('/', (req, res) => {
	res.render('welcome', {
		loggedIn: loggedIn(req)
	})
})

router.get('/about', (req, res) => {
	res.render('about', {
		loggedIn: loggedIn(req)
	})
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	console.log('invitedChat:', req.session.invitedChat)
	let invitedChat = false
	let inviter = false
	if (req.session.invitedChat !== undefined) {
		invitedChat = req.session.invitedChat
		inviter = req.session.inviter
	}

	//if (req.session.invitedChat !== undefined)
	let u = await User.findOne({email: req.user.email}).exec()
	if (u.avatarURL !== null) {
		avatarURL = req.user.name + '_' + path.basename(u.avatarURL)
	} else {
		avatarURL = null
	}
	res.render('dashboard', {
		loggedIn: loggedIn(req),
		name: req.user.name,
		invitedChat: invitedChat,
		inviter: inviter
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

router.post('/joinChat', ensureAuthenticated, (req, res) => {

	const {url} = req.body;
	res.redirect('/chat/' + url)

})

router.post('/joinInvitedChat', ensureAuthenticated, (req, res) => {

	const {invitedUrl} = req.body;
	res.redirect('/chat/' + invitedUrl)

})

router.get('/chat/:id', [isInvited, ensureAuthenticated], async (req, res) => {
	let c = await Chat.findOne({chatURL: req.params.id})
	if (c) {
		delete req.session.invitedChat
		delete req.session.inviter
		res.render('chat', {
			loggedIn: loggedIn(req),
			name: req.user.name,
		})
	} else {
		req.flash('error_msg', `the conversation ${req.params.id} does not exist`)
		res.redirect('/dashboard')
	}
})

module.exports = router
