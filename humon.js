var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://89.150.133.180:1883')
 
//posible machine states : stoped,starting,start,stop,running

var state = 'stoped'

client.on('connect',function(){
    client.subscribe('humon/start')
    client.subscribe('humon/stop')
    client.publish('humon/connected', 'true');
    sendStateUpdate()
})

function sendStateUpdate () {  
  console.log('sending state %s', state)
  client.publish('humon/state', state)
}

client.on('message', (topic, message) => {  
  console.log('received message %s %s', topic, message)
  switch (topic) {
    case 'humon/start':
      return handleStartRequest(message)
    case 'humon/stop':
      return handleStopRequest(message)
  }
})


function handleStartRequest (message) {  
  if (state !== 'start' && state !== 'starting' && state !== 'running') {
    console.log('starting humon on')
    state = 'starting'
    sendStateUpdate()
    

    // simulate door open after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'running'
      sendStateUpdate()
    }, 5000)
  }else{
      console.log("Current sate is not vaild for this operation ")
  }
}


function handleStopRequest (message) {  
  if (state !== 'stoped' && state !== 'stoping' && state !== 'stop') {
    state = 'stoping'
    sendStateUpdate()

    // simulate door closed after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'stoped'
      sendStateUpdate()
    }, 5000)
  }else{
      console.log("Current sate is not vaild for this operation ")
  }
}

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit (options, err) {  
  if (err) {
    console.log(err.stack)
  }

  if (options.cleanup) {
    client.publish('humon/connected', 'false')
  }

  if (options.exit) {
    process.exit()
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {  
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {  
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {  
  exit: true
}))