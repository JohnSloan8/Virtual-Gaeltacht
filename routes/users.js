const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {ensureAuthenticated, ensureNotAuthenticated, loggedIn} = require('../config/auth')
const https = require('https');
const fs = require('fs');
const path = require('path')


// User Model
const User = require('../models/User')

//REGISTER PAGE
router.get('/register', ensureNotAuthenticated, (req, res) => {
	res.render('register', {
		loggedIn: loggedIn(req),
	})
})

// REGISTER HANDLE
router.post('/register', ensureNotAuthenticated, async (req, res) => {
	const {name, email, password, password2 } = req.body
	let errors = []

	// check required fields
	if (!name || !email || !password || !password2) {
		errros.push({msg: "Please fill in all fields"})
	}

	// check passwords match
	if (password !== password2) {
		errors.push({msg: "Passwords do not match"})
	}

	// check password length
	if (password.length < 6) {
		errors.push({msg: "password should be at least 6 characters"})
	}

	let nameExists = await User.exists({name: name})
	if ( nameExists ) {
		errors.push({msg: `The name '${name}' is taken. Please choose another`})
	}

	let emailExists = await User.exists({email: email})
	if ( emailExists ) {
		errors.push({msg: "Email is already registered"})
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2,
			loggedIn: loggedIn(req)
		})
	} else {
		// Validation passed
		const newUser = new User({
			name,
			email,
			password,
			avatarURL: null
		})
		// Hash password
		bcrypt.genSalt(10, (error, salt) => 
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser.save()
					.then(user => {
						req.flash('success_msg', 'You are now registered and can log in')
						res.redirect('/users/login')
					})
					.catch(err => console.log(err))
		}))
	}
})

//LOGIN
router.get('/login', ensureNotAuthenticated, (req, res) => {
	res.render('login', {
		loggedIn: loggedIn(req)
	})
})

//LOGIN Handle
router.post('/login', ensureNotAuthenticated, (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
    failureRedirect: '/users/login',
  	failureFlash: true 
	})(req, res, next);
})

// LOGOT Handle
router.get('/logout', ensureAuthenticated, (req, res) => {
	req.logout();
	req.flash('succes_msg', 'you have been logged out')
	res.redirect('/')
})

// CREATE AVATAR
router.get('/avatar', ensureAuthenticated, (req, res) => {
	res.render('avatar', {
		loggedIn: loggedIn(req),
	})
})

// STORE AVATAR

var download = function(url, dest, name, res, cb) {
  var file = fs.createWriteStream(dest + name +  '_' + path.basename(url));
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
			res.redirect('/dashboard')
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

router.post('/avatar', ensureAuthenticated, (req, res) => {
	const { avatarURL } = req.body
	User.findOneAndUpdate(
		{email: req.user.email},
		{avatarURL: avatarURL}, 
		null, 
		function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Original Doc : ",docs);
    }
	});
	console.log('user: ', req.user)
	console.log('avatarURL: ', avatarURL)
	let dest = path.dirname(require.main.filename) + '/public/avatars/'
	download(avatarURL, dest, req.user.name, res)
})

module.exports = router

