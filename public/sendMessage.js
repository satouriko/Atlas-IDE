const net = require('net')

function send(message, port, address){
    let client = new net.Socket();
    return new Promise((resolve, reject) => {
        client.connect(port, address, ()=>{
            client.on('data', (data)=>{
                console.log('Receive feedback!!!');
                console.log('' + data);
                resolve(JSON.parse('' + data));
            })
            client.write(message);
        });
    })
}

module.exports = {
    send
}
