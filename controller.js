var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://89.150.133.180:1883');

var humonState = ''  
var connected = false

client.on('connect', () => {  
  client.subscribe('humon/connected')
  client.subscribe('humon/state')
})

client.on('message', (topic, message) => {  
  switch (topic) {
    case 'humon/connected':
      return handleHumonConnected(message)
    case 'humon/state':
      return handleHumonState(message)
  }
  console.log('No handler for topic %s', topic)
})

function handleHumonConnected (message) {  
  console.log('humon connected status %s', message)
  connected = (message.toString() === 'true')
}

function handleHumonState (message) {  
  humonState = message
  console.log('humon state update to %s', message)
}


function startHumon () {  
  // can only start humon if we're connected to mqtt and humon isn't already running
  if (connected && humonState !== 'running'|| humonState !== 'starting') {
    // Ask the humon to start
    client.publish('humon/start', 'true')
  }
}

setTimeout(() => {  
  console.log('open door')
  startHumon()
}, 5000)