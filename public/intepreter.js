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
        case 'relationship':
            result = false;
            switch(statement.relationshipType) {
                case 'Control':
                    let services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName,
                        serviceInput: statement.serviceInput,
                    });
                    if(services1.Status == 'Successful') {
                        let services2 = await serviceCall(tweetInfo, {
                            thingID: statement.thingID,
                            entityID: statement.entityID,
                            serviceName: statement.serviceName2,
                            serviceInput: statement.serviceInput2,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'Drive':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName,
                        serviceInput: statement.serviceInput,
                    });
                    if(services1.Status == 'Successful') {
                        let server2Input = [];
                        server2Input.push(services1.getElementById('Service Result'));
                        services2 = await serviceCall(tweetInfo, {
                            thingID: statement.thingID,
                            entityID: statement.entityID,
                            serviceName: statement.serviceName2,
                            serviceInput: server2Input,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'Support':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName2,
                        serviceInput: statement.serviceInput2,
                    });
                    if(services1.Status == 'Successful') {
                        services2 = await serviceCall(tweetInfo, {
                            thingID: statement.thingID,
                            entityID: statement.entityID,
                            serviceName: statement.serviceName1,
                            serviceInput: statement.serviceInput1,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'Extended':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName,
                        serviceInput: statement.serviceInput,
                    });
                    services2 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName2,
                        serviceInput: statement.serviceInput2,
                    });
                    if(services1.Status == 'Successful' && services2.Status == 'Successful') {
                        result = true;
                    }
                    break;
            }
            return result;
        case 'ifThen':
            let ifStatement1 = executeStatement(tweetInfo, statement.ifStatement);
            pass = false;
            if(typeof ifStatement1 == 'boolean') {
                pass  = ifStatement1;
            }else if(ifStatement1.Status == 'Successful') {
                pass = true;
            }
            result = false;
            if(pass) {
                let thenStatement2 = executeStatement(tweetInfo, statement.thenStatement);
                if(typeof ifStatement2 == 'boolean') {
                    result  = ifStatement2;
                }else if(ifStatement2.Status == 'Successful') {
                    result = true;
                }
            }
            return result;
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