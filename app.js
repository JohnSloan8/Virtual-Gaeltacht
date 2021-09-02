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
app.use('/chats', require('./routes/chats'))

const PORT = process.env.PORT || 5000

server.listen(PORT, console.log(`Server started on port ${PORT}`))

const path = require('path')
const Chat = require('./models/Chat')
const { getCurrentParticipants, getLookingAt, getWaitingList, addParticipantToChatModel } = require('./utils.js')
const io = require('socket.io')(server)

const chats = {}
const speakingTimer = {} // check if speaking event longer than 3 seconds
const lookingTimer = {} // check if speaking event longer than 3 seconds
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
			console.log('pl:', clientData['participantList'])
			clientData['waitingList'] = getWaitingList(chat)
			clientData['lookingAt'] = getLookingAt(chat, participantList)
			socket.emit('message', clientData)
			saveChat(chat)
			speakingTimer[clientData.who] = {
				bool: false,
				originalStartTime: null,
				startTime: null,
				finishTime: null
			}
			lookingTimer[clientData.who] = {
				time: null
			}

		// PARTICIPANT REQUESTS ENTRY
		} else { 
			chat = chats[clientData.chatID]
			let reallySave = true
			chat === undefined ? await Chat.findOne({chatURL: path.basename(clientData.chatID)}) : chat
			if ( clientData.type === 'requestEnter' ) {
				console.log('in request enter')
				if (!chat.waitingList.some(n => n.name === clientData.who)) {
					chat.waitingList.push({
						name: clientData.who,
						requirer0: clientData.key[0],
						requirer1: clientData.key[1],
						entering: false
					})
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
				if ( chat.participants.filter(e => e.endTime === null).length === 0 ) {
					console.log('chat ended')
					chat.endDate = Date.now()
				}
				clientData['participantList'] = getCurrentParticipants(chat) // participant list
				io.in(path.basename(clientData.chatID)).emit('message', clientData)

			// ALL GESTURES
			} else {
				socket.to(path.basename(clientData.chatID)).emit('message', clientData);

				// LOOK
				if (clientData.type === "look") {
					checkIfReallyLooking(clientData, 500, chat)
					reallySave = false
				// FACIAL EXPRESSION
				} else if (clientData.type === "expression") {
					chat.expressions.push({
						who: clientData.who,
						expression: clientData.key,
						timestamp: new Date(clientData.timestamp)
					})

				// ARM GESTURE
				} else if (clientData.type === "gesture") {
					chat.gestures.push({
						who: clientData.who,
						gesture: clientData.key,
						timestamp: new Date(clientData.timestamp)
					})

				// NOD OR SHAKE HEAD
				} else if (clientData.type === "nodShake") {
					chat.nodShakes.push({
						who: clientData.who,
						nodShake: clientData.key,
						timestamp: new Date(clientData.timestamp)
					})
				} else if (clientData.type === "speaking") {
					//console.log('in speaking:', clientData.who, clientData.key)
					checkIfSpeakingLongerThanNSeconds(clientData.who, clientData.key, 3000, chat)
					reallySave = false
				}
			}
			saveChat(chat, reallySave)
		}
	})
})

const checkIfSpeakingLongerThanNSeconds = (who, speaking, timeLimit, chat) => {
	try {
		if (!speakingTimer[who].bool) {
			if (speaking) {
				speakingTimer[who].bool = true
				speakingTimer[who].startTime = new Date()
				let gap = speakingTimer[who].startTime - speakingTimer[who].finishTime
				console.log('gap:', gap)
				if (gap > timeLimit) {
					speakingTimer[who].originalStartTime = new Date()
				}
			}
		} else {
			if (!speaking) {
				speakingTimer[who].bool = false
				speakingTimer[who].finishTime = new Date()
				let speakingTime = speakingTimer[who].finishTime - speakingTimer[who].startTime
				console.log('speakingTime:', speakingTime)
				if (speakingTime > timeLimit) {	
					setTimeout( function(){confirmStoreSpeaking(who, speakingTimer[who], chat)}, timeLimit )
				}
			}
		}
	} catch {
		console.log('error in saving speak')
	}
}

const confirmStoreSpeaking = (who, speakingData, chat) => {
	console.log('iin confirmStoreSpeaking')
	let timeElapsed = new Date() - speakingData.finishTime
	if (!speakingTimer[who].bool && timeElapsed > 2900 ) {
		let speakingTime = speakingTimer[who].finishTime - speakingTimer[who].originalStartTime
		console.log('totalspeakingTime:', speakingTime)
		console.log('finishTime:', speakingTimer[who].finishTime)
		chat.speaking.push({
			who: who,
			startTime: speakingData.originalStartTime,
			endTime:	speakingData.finishTime
		})
		saveChat(chat, true)
		console.log('storing chat')
	}
}

const checkIfReallyLooking = (clientData, delay, chat) => {
	lookingTimer[clientData.who] = {
		who: clientData.who,
		whom: clientData.key,
		body: clientData.body,
		time: new Date()
	}
	setTimeout( function() {
		let timeElapsed = new Date() - lookingTimer[clientData.who].time
		console.log('timeElapsed', timeElapsed)
		if (timeElapsed > delay-100) {
			if (!lookingTimer[clientData.who]['currentlySavedLookingAt']) {
				chat.lookingAt.push({
					who: clientData.who,
					whom: clientData.key,
					body: clientData.body,
					timestamp: lookingTimer[clientData.who].time
				})
				lookingTimer[clientData.who]['currentlySavedLookingAt'] = clientData.key
				saveChat(chat, true)
			}
		}
	}, delay )
}

// this avoids the parrallel save error with mongoose
const saveChat = async (chat, reallySave) => {
	if (reallySave) {
		try {
			await chat.save()
		} catch (err) {
			console.log('error')
			console.log(err)
			setTimeout( function() {saveChat(chat), 200})
		}		
	}
}

