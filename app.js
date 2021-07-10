const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// Passport config
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').MongoURI

// Connect to Mongo
mongoose.connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true}
	)
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Bodyparser (now with express)
app.use(express.urlencoded({extended: false}))

// Express Session Middleware
app.use(session({
  secret: 'keyboard dog',
  resave: true,
  saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	next();
})

// STATIC
app.use(express.static('public'))

// ROUTES
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
