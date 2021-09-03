import { chatData, chartData } from "./init.js"

// LEAVE THIS UNTIL I HAVE SOME DATA

const displayLookingAtChart = () => {
  var ctx = document.getElementById('lookingAtChart').getContext('2d');
  setChartHeight();
  createLookingAtData();
  thisChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(chartData.lookingAtData),
      datasets: [{
        data: Object.values(chartData.lookingAtData),
        backgroundColor: '#7f99c7'
      }],
    },
    options: getOptions()
  });
}

const setChartHeight = () => {
  chartData.height = 100
  chartData.DOMElement = document.getElementById('lookingAtChart')
  chartData.DOMElement.height = chartData.height
}

const createLookingAtData = () => {
  getEmptySpeakingDict()
}
window.createLookingAtData = createLookingAtData

const getEmptySpeakingDict = () => {
  chartData.speakingDict = {}
  let startUnixTime = Math.floor(new Date(chatData.startDate).getTime()/1000)
  let endUnixTime = Math.floor(new Date(chatData.endDate).getTime()/1000)
  if (startUnixTime !== null && endUnixTime !== null) {
    for (let i=startUnixTime; i<=endUnixTime; i++) {
      chartData.speakingDict[i] = []
    }
    addSpeakers()
  } else {
    console.log('start or end time is null')
  }
}

const addSpeakers = () => {
  chatData.speaking.forEach( s => {
    let startUnixTime = Math.floor(new Date(s.startTime).getTime()/1000)
    let endUnixTime = Math.floor(new Date(s.endTime).getTime()/1000)
    for (let i=startUnixTime; i<=endUnixTime; i++) {
      chartData.speakingDict[i].push(s.who)
    }
  } )
  addLookingDict()
}

const addLookingDict = () => {
  chartData.lookingAtDict = {}
  chartData.participants.forEach( p => {
    chartData.lookingAtDict[p] = {}
    let thisParticipantsLookingData = chatData.lookingAt.filter(n => n.who === p)
    thisParticipantsLookingData.forEach( (l, i) => {
      let startUnixTime = Math.floor(new Date(l.timestamp).getTime()/1000)
      let endUnixTime
      if (thisParticipantsLookingData[i+1] !== undefined) {
         endUnixTime = Math.floor(new Date(thisParticipantsLookingData[i+1].timestamp).getTime()/1000)
      } else {
         endUnixTime = Math.floor(new Date(chatData.participants.find(m => m.name === p).endTime).getTime()/1000)
      }
      for (let i=startUnixTime; i<=endUnixTime; i++) {
        chartData.lookingAtDict[p][i] = l.whom
      }
    })
  })
  fillSpeakingDict()
}

const fillSpeakingDict = () => {
  chartData.lookingAtSpeakerBooleanDict = {}
  for (const [name, lookingAtData] of Object.entries(chartData.lookingAtDict)) {
    chartData.lookingAtSpeakerBooleanDict[name] = []
    for (const [time, whom] of Object.entries(lookingAtData)) {
      if (chartData.speakingDict[time] !== undefined) {
        if (!chartData.speakingDict[time].includes(name) && chartData.speakingDict[time].length !== 0) {
          if (chartData.speakingDict[time].includes(whom)) {
            chartData.lookingAtSpeakerBooleanDict[name].push(true)
          } else {
            chartData.lookingAtSpeakerBooleanDict[name].push(false)
          }
        }
      } 
    }
  }
  outputDataForChart()
}

const outputDataForChart = () => {
  chartData.lookingAtData = {};
  const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

  for (const [name, arr] of Object.entries(chartData.lookingAtSpeakerBooleanDict)) {
    let trues = countOccurrences(arr, true)
    let percentTrue = Math.ceil(100 * trues / arr.length)
    chartData.lookingAtData[name] = percentTrue  
  }
}


















//const getSpeakingDict = p => {

  //let thisParticipantsLookingData = chatData.lookingAt.filter(n => n.who === p)
  //thisParticipantsLookingData.forEach( (l, i) => {
    //if (i !== 0) {
      //let startTime = l.timestamp
      //let endTime = thisParticipantsLookingData[i-1].timestamp
      //let who = thisParticipantsLookingData[i-1].whom

      //chartData.lookingAt[p][who].push({
        //startTime: startTime,
        //endTime: endTime,
      //})
      ////data.push({x: new Date(l.timestamp), y: l.whom})
    //}
  //})
//}

const checkWhenLookingWithoutSpeaking = () => {

  chartData.lookingAtWithoutSpeaking = {}
  chartData.participants.forEach(p => {
    chartData.lookingAt[p].forEach(l => {
      chartData.speaking.forEach(s => {
        if (s.who === p) {
          let c = twoPeriodsCoincide()
          
        }
      })
    }) 
  })
}

const twoPeriodsCoincide = (s1, e1, s2, e2) => {
  s1 = new Date(s1)
  e1 = new Date(e1)
  s2 = new Date(s2)
  e2 = new Date(e2)
  if (s1 < s2 && e1 < e2 && s2 < e1) {
    return "end"
  } else if (e1 > e2 && s2 > s1) {
    return "middle"
  } else if (s1 > s2 && e1 < e2) {
    return "whole" 
  } else if (s1 > s2 && e1 > e2 && e2 > s1) {
    return "start"
  } else {
    return false
  }
}
window.twoPeriodsCoincide = twoPeriodsCoincide

const getTotalSpeakingTimeWithinPeriod = (who, start, finish) => {

  let allSpeakingData = chatData.speaking.filter(s => s.who === who)
  start = new Date(start)
  finish = new Date(finish)

  let time = 0
  allSpeakingData.forEach(s => {
    let sS = new Date(s.startTime)
    let sE = new Date(s.endTime)
    if (sS < start && sE < finish) {
      time += sE-start
    } else if (sS < finish && sE > finish) {
      time += finish-sS
    } else if (sS > start && sE < finish) {
      time += sE-sS
    }
  })
  console.log('time:', time/60000)
}

//const getTotalA

window.getTotalSpeakingTimeWithinPeriod = getTotalSpeakingTimeWithinPeriod

const getOptions = () => {
  let options = {
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontSize: 20,
          fontColor: "white",
          padding: 0,
        },
      }],
      yAxes: [{
        ticks: {
          fontSize: 16,
          fontColor: 'white',
          beginAtZero: true,
          stepSize: 20,
          min: 0,
          max: 100,
        },
        scaleLabel: {
          display: true,
          labelString: '% time looking at a speaker',
          fontColor: 'white',
          fontSize: 14
        }
      }]
    },
    layout: {
      padding: 30
    },
    legend: {
      display: false
    },
  }
  return options
}

export { displayLookingAtChart }
