import { chatData, chartData } from "./init.js"

var thisChart
const displaySpeakingChart = () => {
  var ctx = document.getElementById('speakingChart').getContext('2d');
  setChartHeight();
  thisChart = new Chart(ctx, {
    type: 'line',
    data: getData(),
    options: getOptions()
  });
  window.thisChart = thisChart
}

const setChartHeight = () => {
  let width = $('#chatID').width()
  chartData.height = chartData.participants.length * 33 
  chartData.DOMElement = document.getElementById('speakingChart')
  chartData.DOMElement.height = chartData.height
}

const getData = () => {
  let data = {
    datasets: getDatasets()
  }
  return data
}

const getDatasets = () => {
  let datasets = []
  let width = $('#chatID').width()
  chartData.participants.forEach( p => {
    let speakingDataset = {
      label: p,
      data: getSpeakingData(p),
      borderColor: 'yellow',
      borderWidth: width/20,
      pointRadius: 0,
      fill: false,
    }
    let attendanceDataset = {
      label: p,
      data: getAttendanceData(p),
      borderColor: "rgba(200,200,200,0.3)",
      borderWidth: width/20,
      pointRadius: 0,
      fill: false,
    }
    //let lookingDataset = {
      //label: p,
      //data: getLookingData(p),
      //borderColor: chartData.participantColours[p],
      //borderWidth: 3,
      //pointRadius: 2,
      //fill: false,
    //}
    datasets.push(attendanceDataset)
    datasets.push(speakingDataset)
    //datasets.push(lookingDataset)
  })
  console.log('datasets:', datasets)
  return datasets
}

const getAttendanceData = p => {
  let data = []
  chartData.attendanceData = chatData.participants.filter(n => n.name === p)
  chartData.attendanceData.forEach( a => {
    data.push({x: new Date(a.startTime), y: p})
    let endTime = a.endTime
    if (a.endTime === null) {
      if (chatData.endDate !== null) {
        endTime = chatData.endDate
      } else {
        endTime = new Date()
      }
    }
    data.push({x: new Date(endTime), y: p})
    data.push({x: NaN, y: NaN})
  })
  return data
}

const getSpeakingData = p => {
  let data = []
  let thisParticipantsSpeakingData = chatData.speaking.filter(n => n.who === p)
  thisParticipantsSpeakingData.forEach( s => {
    data.push({x: new Date(s.startTime), y: p})
    data.push({x: new Date(s.endTime), y: p})
    data.push({x: NaN, y: NaN})
  })
  return data
}

//const getLookingData = p => {
  //let data = []
  //let thisParticipantsLookingData = chatData.lookingAt.filter(n => n.who === p)
  //thisParticipantsLookingData.forEach( (l, i) => {
    //if (i !== 0) {
      //data.push({x: new Date(l.timestamp), y: thisParticipantsLookingData[i-1].whom})
    //}
    //data.push({x: new Date(l.timestamp), y: l.whom})
  //})
  //return data
//}

const getOptions = () => {
  let options = {
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        gridLines: {
          drawBorder: false,
        },
        time: {
          min: new Date(chatData.startDate), 
          max: new Date(chatData.endDate) 
        },
        ticks: {
          fontSize: 16,
          fontColor: "white",
          padding: 30,
          beginAtZero: true
        },
      }],
      yAxes: [{
        type: 'category',
        labels: chartData.participants,
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          fontSize: 20,
          fontColor: 'yellow',
        }
      }]
    },
    layout: {
      padding: 25 
    },
    legend: {
      display: false
    },
    elements: {
      line: {
        tension: 0
      }
    }
  }
  return options
}

export { displaySpeakingChart }
