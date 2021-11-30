function startReceiveTweet(tweetInfo){
    var PORT = 1235;
    var HOST = '10.20.23.65';
    var dgram = require('dgram');
    var client = dgram.createSocket('udp4');

    client.on('listening', function () {
        var address = client.address();
        console.log('UDP Client listening on ' + address.address + ":" + address.port);
        client.setBroadcast(true)
        client.setMulticastTTL(128); 
        client.addMembership('232.1.1.1', '10.20.23.65');
    });

    client.on('message', function (message, remote) {   
        //console.log('A: Epic Command Received. Preparing Relay.');
        //console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
        let tweetObject = JSON.parse(('' + message).replaceAll('"Input"','Input').replaceAll('"Input1"','Input1').replaceAll('"Input2"','Input2'));
        console.log(tweetObject);
    });

    client.bind(PORT, HOST);
}

module.exports = {
    startReceiveTweet
}
