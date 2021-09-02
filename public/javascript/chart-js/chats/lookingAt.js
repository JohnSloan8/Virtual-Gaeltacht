import { chatData, chartData } from "./init.js"

// LEAVE THIS UNTIL I HAVE SOME DATA

const displayLookingAtChart = () => {
  var ctx = document.getElementById('lookingAtChart').getContext('2d');
  setChartHeight();
  thisChart = new Chart(ctx, {
    type: 'bar',
    data: getData(),
    options: getOptions()
  });
}

const setChartHeight = () => {
  chartData.height = 100
  chartData.DOMElement = document.getElementById('lookingAtChart')
  chartData.DOMElement.height = chartData.height
}

const getData = () => {
  let data = {
    datasets: getDatasets(),
    labels: chatData.participants
  }
  return data
}

const getDatasets = () => {
  let datasets = []
  chartData.participants.forEach( p => {
    let lookingDataset = {
      label: p,
      type: "bar",
      data: getLookingData(p),
      stack: "base",
      backgroundColor: "yellow"
    }
    datasets.push(lookingDataset)
  })
  console.log('datasets:', datasets)
  return datasets
}


const getLookingData = p => {

  let thisParticipantsLookingData = chatData.lookingAt.filter(n => n.who === p)
  thisParticipantsLookingData.forEach( (l, i) => {
    if (i !== 0) {
      let startTime = l.timestamp
      let endTime = thisParticipantsLookingData[i-1].timestamp
      let who = thisParticipantsLookingData[i-1].whom

      chartData.lookingAt[p][who].push({
        startTime: startTime,
        endTime: endTime,
      })
      //data.push({x: new Date(l.timestamp), y: l.whom})
    }
  })
}

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
        stacked: true
        //type: 'time',
        //distribution: 'linear',
        //gridLines: {
          //drawBorder: false,
        //},
        //time: {
          //min: new Date(chatData.startDate), 
          //max: new Date(chatData.endDate) 
        //},
        //ticks: {
          //fontSize: 16,
          //fontColor: "white",
          //padding: 0,
          //beginAtZero: true
        //},
      }],
      yAxes: [{
        stacked: true
        //type: 'category',
        //labels: chartData.participants,
        //gridLines: {
          //display: false,
          //drawBorder: false,
        //},
        //ticks: {
          //fontSize: 20,
          //fontColor: 'white',
          //callback: function(tickValue, index, ticks) {
                        //return tickValue;
                    //}
        //}
      }]
    //},
    //layout: {
      //padding: 30
    //},
    //legend: {
      //display: false
    //},
    //elements: {
      //line: {
        //tension: 0
      //}
    }
  }
  return options
}

export { displayLookingAtChart }
