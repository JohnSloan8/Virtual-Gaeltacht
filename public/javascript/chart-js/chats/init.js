import { displayLookingAtChart } from './lookingAt.js'
import { displaySpeakingChart } from './speaking.js'

var chatData
const chartData = {}
var username
const getChatData = () => {
 fetch(window.location.href + '/api')
  .then(response => response.json())
  .then(data => {
    chatData = data.chatData;
    username = data.username;
    window.username = username
    window.chartData = chartData
    window.chatData = chatData
    initCharts();  
  });
}
getChatData();

const initCharts = () => {
  displayNameAndDateOfChat()
  getChatParticipants()
  displaySpeakingChart()
  displayLookingAtChart()
}

const displayNameAndDateOfChat = () => {
  $('#chatID').text(chatData.chatURL)
}

const getChatParticipants = () => {
  let participantSet = new Set(chatData.participants.map(p => p.name))
  chartData.participants = [...participantSet]
  chartData.lookingAt = {}
  chartData.participantColours = {}
  chartData.participants.forEach(p => {
    chartData.participantColours[p] = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", 1)"
    
    chartData.lookingAt[p] = {}
    chartData.participants.forEach(q => {
        if (p !== q) {
            chartData.lookingAt[p][q] = []
        }
    })
  })
}

export { chatData, chartData }
