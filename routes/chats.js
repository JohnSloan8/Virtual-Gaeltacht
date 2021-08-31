const express = require('express')
const router = express.Router()
const moment = require('moment');
const Chat = require('../models/Chat')
const {ensureAuthenticated, ensureNotAuthenticated, loggedIn} = require('../config/auth')

router.get('/chat-history', ensureAuthenticated, async (req, res) => {
	let myChats = await Chat.find({"participants.name": req.user.name})
	console.log('myChats:', myChats)
	let basicChatData = []
	myChats.forEach( c => {

		let participants = []
		c.participants.forEach( p => {
			participants.push(p.name)
		} )
		let uniqueParticipants = [...new Set(participants)]

		endDate = ""
		if (c.endDate !== null) {
			endDate = moment(c.endDate).format('h:mm a')
		}

		basicChatData.push({
			chatURL: c.chatURL,
			startDateReal: c.startDate,
			startDate: moment(c.startDate).format('MMMM Do YYYY, h:mm a'),
			endDate: endDate,
			dateFromNow: moment(c.startDate).fromNow(),
			createdBy: c.createdBy,
			participants: uniqueParticipants
		})
	})
	basicChatData.sort(function(a, b) {
    return b.startDateReal - a.startDateReal;
	})
	res.render('chat-history', {
		loggedIn: loggedIn(req),
		basicChatData: basicChatData
	})
})

router.get('/chat-history/:id', ensureAuthenticated, (req, res) => {
	res.render('chats', {
		loggedIn: loggedIn(req),
	})
})

router.get('/chat-history/:id/api', ensureAuthenticated, async (req, res) => {
	let c = await Chat.findOne({chatURL: req.params.id})
	res.json({ chatData: c })
})

module.exports = router
