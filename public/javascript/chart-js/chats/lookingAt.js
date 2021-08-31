let chartData = {}

const displayLookingAtChart = () => {
  var ctx = document.getElementById('mainChart').getContext('2d');
  getChatParticipants();
  setChartHeight();
  var myChart = new Chart(ctx, {
    type: 'line',
    data: getLookingAtData(),
    options: getOptions()
  });
}

const getChatParticipants = () => {
  let participantSet = new Set(chatData.participants.map(p => p.name))
  chartData.participants = [...participantSet]
  chartData.participantColours = {}
  chartData.participants.forEach(p => {
    chartData.participantColours[p] = "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ", 1)"
  })
  console.log('color', chartData.participantColours)
}

const setChartHeight = () => {
  chartData.height = chartData.participants.length * 30
  chartData.DOMElement = document.getElementById('mainChart')
  chartData.DOMElement.height = chartData.height
}

const getLookingAtData = () => {
  let data = {
    datasets: getDatasets()
  }
  return data
}

const getDatasets = () => {
  let datasets = []
  chartData.participants.forEach( p => {
    let speakingDataset = {
      label: p,
      data: getSpeakingData(p),
      borderColor: "yellow",
      borderWidth: 50,
      pointRadius: 0,
      fill: false,
    }
    let attendanceDataset = {
      label: p,
      data: getAttendanceData(p),
      borderColor: "rgba(200,200,200,0.3)",
      borderWidth: 50,
      pointRadius: 0,
      fill: false,
    }
    datasets.push(attendanceDataset)
    datasets.push(speakingDataset)
  })
  console.log('datasets:', datasets)
  return datasets
}

const getAttendanceData = p => {
  let data = []
  let thisParticipantsAttendanceData = chatData.participants.filter(n => n.name === p)
  thisParticipantsAttendanceData.forEach( a => {
    data.push({x: new Date(a.startTime), y: p})
    data.push({x: new Date(a.endTime), y: p})
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

const getOptions = () => {
  let options = {
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          min: new Date(chatData.startDate), 
          max: new Date(chatData.endDate) 
        },
        bounds: 'ticks',
        color: 'white'
      }],
      yAxes: [{
        type: 'category',
        labels: chartData.participants
      }]
    }
  }
  return options
}

export { displayLookingAtChart }
