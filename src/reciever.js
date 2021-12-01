var PORT = 1235;
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
  var address = client.address();
  console.log('UDP Client listening on ' + address.address + ":" + address.port);
  client.addMembership('232.1.1.1', '10.20.23.61');
});

client.on('message', function (message, remote) {
  console.log('From: ' + remote.address + ':' + remote.port + ' - ' + message);
});

client.bind(PORT);