const {executeStatement} = require('./intepreter.js');

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
        client.addMembership('232.1.1.1', HOST);
    });

    client.on('message', function (message, remote) {   
        //console.log('A: Epic Command Received. Preparing Relay.');
        //console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
        let tweetObject = JSON.parse(('' + message).replaceAll('"Input"','Input').replaceAll('"Input1"','Input1').replaceAll('"Input2"','Input2'));
        //console.log(tweetObject);
        switch (tweetObject['Tweet Type']) {
            case 'Identity_Language':
                tweetInfo.Identity_Language[tweetObject['Thing ID']] = tweetObject;
                tweetInfo.Identity_Language[tweetObject['Thing ID']].IP = remote.address;
                break;
            case 'Identity_Entity':
                tweetInfo.Identity_Entity[tweetObject['Thing ID'] + tweetObject['ID']] = tweetObject;
                break;
            case 'Identity_Thing':
                tweetInfo.Identity_Thing[tweetObject['Thing ID']] = tweetObject;
                break;
            case 'Service':
                //console.log('Service!!');
                tweetInfo.Service[tweetObject['Thing ID'] + tweetObject['Entity ID'] + tweetObject['Name']] = tweetObject;
                /*
                if(tweetObject['Name'] == 'TurnOff') {
                    executeStatement(tweetInfo, {
                        type: 'service',
                        thingID: tweetObject['Thing ID'],
                        entityID: tweetObject['Entity ID'],
                        serviceName: tweetObject['Name'],
                        serviceInput: [0]
                    });
                }
                */
                break;
            case 'Relationship':
                //console.log('relationship!!');
                tweetInfo.Relationship[tweetObject['Thing ID'] + tweetObject['Entity ID'] + tweetObject['Name']] = tweetObject;
                break;
            default:
                break;
        }
    });

    client.bind(PORT, HOST);
}

module.exports = {
    startReceiveTweet
}
