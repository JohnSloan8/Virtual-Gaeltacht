const displayLookingAtChart = () => {
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: getLookingAtData(),
    options: getOptions()
  });
}

const getLookingAtData = () => {
  let data = {
    labels: getTimeXAxisLabels(),
    datasets: getDatasets()
  }
  console.log('data:', data)
  return data
}

const getTimeXAxisLabels = () => {
  let minutesInTens = Math.ceil((new Date(chatData.endDate).getTime() - new Date(chatData.startDate).getTime())/600000)
  let labels = [0,1,2,3,4,5,6,7,8,9,10]
  labels = labels.map(n => n*minutesInTens)
  //let labels = [new Date(chatData.startDate), new Date(chatData.endDate)] 
  //let labels = ['2020-02-15 18:37:41', '2020-02-15 18:37:42'] 
  return labels
}

const getDatasets = () => {
  let datasets = []
  let chatParticipants = getChatParticipants() // returns a Set to iterate through
  //Object.keys(chatParticipants).forEach( p => {
    let thisDataset = {
      //label: p,
      label: "john",
      data: getAttendanceData("john", chatParticipants["john"]),
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 5,
      //segment: {
        ////borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
        ////borderDash: ctx => skipped(ctx, [6, 6]),
      //}
    }
    datasets.push(thisDataset)
  //})
  console.log('datasets:', datasets)
  return datasets
}

const getChatParticipants = () => {
  let participantOrderDictionary = {} 
  let participantSet = new Set(chatData.participants.map(p => p.name))
  let participantArray = [...participantSet]
  participantArray.forEach((n, i) => {
    participantOrderDictionary[n] = i
  })
  return participantOrderDictionary
}

const getAttendanceData = (p, yVal) => {
  let data = []
  let thisParticipantsAttendanceData = chatData.participants.filter(n => n.name === p)
  thisParticipantsAttendanceData.forEach( a => {
    data.push({x: (new Date(a.startTime).getTime() - new Date(chatData.startDate).getTime())/60000, y: yVal})
    data.push({x: (new Date(a.endTime).getTime() - new Date(chatData.startDate).getTime())/60000, y: yVal})
    data.push({x: NaN, y: NaN})
  })
  return data
}

const getOptions = () => {
  let options = {
    scales: {
      xAxes: [{
        type: 'time',
        distribution: 'linear'
      }]
    }
  }
  return options
}

export { displayLookingAtChart }
