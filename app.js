const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express()
const server = require('http').Server(app)
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo');

// Passport config
require('./config/passport')(passport)

// DB Config
//const db = require('./config/keys').MongoURI
const db = 'mongodb+srv://john:Mongodbtiger8*@cluster0.4ij60.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

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
	store: MongoStore.create( { mongoUrl: db } ) // added this to persist sessions (from https://www.youtube.com/watch?v=K9uBynMc_Ys and the connect-mongo docs)
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

server.listen(PORT, console.log(`Server started on port ${PORT}`))

const path = require('path')
const Chat = require('./models/Chat')
const { getCurrentParticipants, getLookingAt, getWaitingList, addParticipantToChatModel } = require('./utils.js')
const io = require('socket.io')(server)

const chats = {}
io.on('connection', socket => {
	
	socket.on('message', async clientData => {
		console.log('clientData: ', clientData.type)

		// NEW CONNECTION
		if ( clientData.type === 'newConnection' ) {
			chat = await Chat.findOne({chatURL: path.basename(clientData.chatID)})
			chats[clientData.chatID] = chat
			socket.join(path.basename(clientData.chatID))
			let participantList = getCurrentParticipants(chat) // participant list
			clientData['firstEntry'] = (participantList.includes(clientData.who)) ? false: true
			if (chat.participants.length === 0) {
				addParticipantToChatModel(chat, clientData.who)
				participantList = getCurrentParticipants(chat) // participant list
			}
			clientData['participantList'] = participantList
			clientData['waitingList'] = getWaitingList(chat)
			clientData['lookingAt'] = getLookingAt(chat, participantList)
			socket.emit('message', clientData)

		// PARTICIPANT REQUESTS ENTRY
		} else { 
			chat = chats[clientData.chatID]
			if ( clientData.type === 'requestEnter' ) {
				console.log('in request enter')
				if (!chat.waitingList.some(n => n.name === clientData.who)) {
					chat.waitingList.push({
						name: clientData.who,
						requirer0: clientData.key[0],
						requirer1: clientData.key[1],
						entering: false
					})
					chat.save()
				}
				clientData['waitingList'] = getWaitingList(chat)
				socket.to(path.basename(clientData.chatID)).emit('message', clientData);
			
			// HOST ADMITS OR REFUSES ENTRY
			} else if ( clientData.type === 'admitRefuse' ) {
				let newParticipant = chat.waitingList.shift()
				let requirer1 = chat.participants.find(p => p.name === newParticipant.requirer1)
				if (clientData.key === 'admit') {
					chat.participants.splice(chat.participants.indexOf(requirer1), 0, {
						name: newParticipant.name,
						endTime: null
					})
					chat.waitingList = []
				} 
				chat.save()
				clientData['admittedRefusedParticipant'] = newParticipant.name
				clientData['participantList'] = getCurrentParticipants(chat) // participant list
				clientData['waitingList'] = getWaitingList(chat)
				clientData['lookingAtEntry'] = getLookingAt(chat, clientData['participantList'])
				clientData['lookingAtEntry'][newParticipant.name] = [newParticipant.requirer1, false]
				io.in(path.basename(clientData.chatID)).emit('message', clientData)

			// NEW PARTICIPANT ADMITTED
			} else if ( clientData.type === 'newParticipant' ) {
				socket.to(path.basename(clientData.chatID)).emit('message', clientData);

			// PARTICIPANT LEAVES
			} else if ( clientData.type === 'removeParticipant' ) {
				let p = chat.participants.find(e => e.name === clientData.who && e.endTime === null)
				p.endTime = Date.now()
				chat.save()
				console.log('removeParticipant:', chat.participants)
				clientData['participantList'] = getCurrentParticipants(chat) // participant list
				io.in(path.basename(clientData.chatID)).emit('message', clientData)

			// ALL GESTURES
			} else {
				socket.to(path.basename(clientData.chatID)).emit('message', clientData);

				// LOOK
				if (clientData.type === "look") {
					chat.lookingAt.push({
						who: clientData.who,
						whom: clientData.key,
						body: clientData.body,
						timestamp: new Date(clientData.timestamp)
					})
					chat.save();

				// FACIAL EXPRESSION
				} else if (clientData.type === "expression") {
					chat.expressions.push({
						who: clientData.who,
						expression: clientData.expression,
						timestamp: new Date(clientData.timestamp)
					})
					chat.save();

				// ARM GESTURE
				} else if (clientData.type === "gesture") {
					chat.gestures.push({
						who: clientData.who,
						gesture: clientData.gesture,
						timestamp: new Date(clientData.timestamp)
					})
					chat.save();

				// NOD OR SHAKE HEAD
				} else if (clientData.type === "nodShake") {
					chat.nodShakes.push({
						who: clientData.who,
						nodShake: clientData.nodShake,
						timestamp: new Date(clientData.timestamp)
					})
					chat.save();
				}
			}
		}
	})
})



