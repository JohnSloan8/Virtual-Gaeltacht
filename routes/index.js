const express = require('express')
const router = express.Router()
const {ensureAuthenticated, loggedIn} = require('../config/auth')
const path = require('path')

// User Model
const User = require('../models/User')

router.get('/', (req, res) => {
	res.render('welcome', {
		loggedIn: loggedIn(req)
	})
})

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	let u = await User.findOne({email: req.user.email}).exec()
	//console.log('u: ', u.avatarURL)
	res.render('dashboard', {
		loggedIn: loggedIn(req),
		name: req.user.name,
		avatarURL: req.user.name + '_' + path.basename(u.avatarURL)
	})
})

module.exports = router
