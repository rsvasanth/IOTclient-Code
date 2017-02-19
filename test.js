
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://89.150.133.180:1883');

var topic = '';
var payload = '';
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(function prompt() {
  rl.question('Enter Your Topic : ', function(answer) {
     topic = 'humon/'+answer;
      rl.question('Enter The Payload : ',function(answer){
         payload = answer; 
          client.publish(topic, payload);
           prompt();
      })
      
   
  });
})();