const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const path = require('path')
const Chat = require('../../models/Chat')
const { getCurrentParticipants, getLookingAt, getWaitingList, addParticipantToChatModel } = require('./utils.js')

var chat
function initWebSocket() {

	wss.on('connection', function connection(ws) {

		ws.on('message', async function incoming(clientMessage) {
			let clientData = JSON.parse(clientMessage)
			console.log('clientMessage: ', clientMessage)

			// NEW CONNECTION
			if ( clientData.type === 'newConnection' ) {
				chat = await Chat.findOne({chatURL: path.basename(clientData.chatURL)})
				let participantList = getCurrentParticipants(chat) // participant list
				clientData['firstEntry'] = (participantList.includes(clientData.who)) ? false: true
				if (chat.participants.length === 0) {
					addParticipantToChatModel(chat, clientData.who)
					participantList = getCurrentParticipants(chat) // participant list
				}
				clientData['participantList'] = participantList
				clientData['waitingList'] = getWaitingList(chat)
				clientData['lookingAt'] = getLookingAt(chat, participantList)
				ws.send(JSON.stringify(clientData))

			// PARTICIPANT REQUESTS ENTRY
			} else if ( clientData.type === 'requestEnter' ) {
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
				wss.clients.forEach(function each(client) {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(clientData));
					}
				});
			
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
				wss.clients.forEach(function each(client) {
					if (client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(clientData));
					}
				});

			// NEW PARTICIPANT ADMITTED
			} else if ( clientData.type === 'newParticipant' ) {
				wss.clients.forEach(function each(client) {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(clientMessage);
					}
				});

			// PARTICIPANT LEAVES
			} else if ( clientData.type === 'removeParticipant' ) {
				let p = chat.participants.find(e => e.name === clientData.who && e.endTime === null)
				p.endTime = Date.now()
				chat.save()
				console.log('removeParticipant:', chat.participants)
				clientData['participantList'] = getCurrentParticipants(chat) // participant list
				wss.clients.forEach(function each(client) {
					if ( client.readyState === WebSocket.OPEN) {
						client.send(JSON.stringify(clientData));
					}
				});
			// ALL GESTURES
			} else {
				wss.clients.forEach(function each(client) {
					if (client !== ws && client.readyState === WebSocket.OPEN) {
						client.send(clientMessage);
					}
				});

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
		});

	});
}

module.exports = initWebSocket
