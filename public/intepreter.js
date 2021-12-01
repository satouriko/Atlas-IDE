const { send } = require('./sendMessage.js');

/*
let statement = {
    type: '',//service, relationship or ifthen
    thingID: '',//service if type is service, service1 if type is relationship
    entityID: '',
    serviceName: '',
    serviceInput: [],
    relationshipType: '',
    thingID2: '',
    entityID2: '',
    serviceName2: '',
    serviceInput2: [],
    ifStatement: {},
    thenStatement: {}
}
*/

function listToString(list){
    let output = '(';
    for(let i = 0; i < list.length; i++){
        if(i == list.length - 1){
            output += list[i];
        }else{
            output += list[i] + ',';
        }
    }
    output += ')';
    return output;
}

async function executeStatement(tweetInfo, statement){
    console.log('Try to execute!!');
    switch (statement.type) {
        case 'service':
            let result = await serviceCall(tweetInfo, {
                thingID: statement.thingID,
                entityID: statement.entityID,
                serviceName: statement.serviceName,
                serviceInput: statement.serviceInput
            });
            return result;
            break;
        case 'relationship':
            
            break;
        case 'ifThen':
            break;
        default:
            break;
    }
}

/*
let serviceInfo = {
    thingID: '',
    entityID: '',
    serviceName: '',
    serviceInput: []
}
*/

async function serviceCall(tweetInfo, serviceInfo){
    if(tweetInfo.Identity_Language[serviceInfo.thingID] !== undefined){
        let output = {};
        let APIresult = '';
        output['Tweet Type'] = 'Service call';
        output['Thing ID'] = serviceInfo.thingID;
        output['Space ID'] = tweetInfo.Service[serviceInfo.thingID + serviceInfo.entityID + serviceInfo.serviceName]['Space ID'];
        output['Service Name'] = serviceInfo.serviceName;
        output['Service Inputs'] = listToString(serviceInfo.serviceInput);
        APIresult = JSON.stringify(output);
        let address = tweetInfo.Identity_Language[serviceInfo.thingID].IP;
        let port = tweetInfo.Identity_Language[serviceInfo.thingID].Port;
        let result = await send(APIresult, port, address);
        console.log(result);
        return result;
    }
}

module.exports = {
    executeStatement
}