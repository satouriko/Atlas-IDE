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
    let result = false;
    let service1 = {};
    let service2 = {};
    switch (statement.type) {
        case 'service':
            let sResult = await serviceCall(tweetInfo, {
                thingID: statement.thingID,
                entityID: statement.entityID,
                serviceName: statement.serviceName,
                serviceInput: statement.serviceInput
            });
            return sResult;
        case 'relationship':
            result = false;
            switch(statement.relationshipType) {
                case 'control':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName,
                        serviceInput: statement.serviceInput,
                    });
                    if(services1.Status == 'Successful') {
                        services2 = await serviceCall(tweetInfo, {
                            thingID: statement.thingID2,
                            entityID: statement.entityID2,
                            serviceName: statement.serviceName2,
                            serviceInput: statement.serviceInput2,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'drive':
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
                            thingID: statement.thingID2,
                            entityID: statement.entityID2,
                            serviceName: statement.serviceName2,
                            serviceInput: statement.serviceInput2,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'support':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID2,
                        entityID: statement.entityID2,
                        serviceName: statement.serviceName2,
                        serviceInput: statement.serviceInput2,
                    });
                    if(services1.Status == 'Successful') {
                        services2 = await serviceCall(tweetInfo, {
                            thingID: statement.thingID,
                            entityID: statement.entityID,
                            serviceName: statement.serviceName,
                            serviceInput: statement.serviceInput,
                        });
                        if(services2.Status == 'Successful') {
                            result = true;
                        }
                    }
                    break;
                case 'extend':
                    services1 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID,
                        entityID: statement.entityID,
                        serviceName: statement.serviceName,
                        serviceInput: statement.serviceInput,
                    });
                    services2 = await serviceCall(tweetInfo, {
                        thingID: statement.thingID2,
                        entityID: statement.entityID2,
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
            let pass = false;    
            try {
                let ifStatement1 = await executeStatement(tweetInfo, statement.ifStatement);
                if(typeof ifStatement1 == 'boolean') {
                    pass  = ifStatement1;
                }else if(ifStatement1.Status == 'Successful') {
                    pass = true;
                }
            }catch(err) {
                console.log(err);
            }finally {
                console.log("if exit\n");
            }
            result = false;
            if(pass) {
                try {
                    let thenStatement2 = await executeStatement(tweetInfo, statement.thenStatement);
                    if(typeof thenStatement2 == 'boolean') {
                        result  = thenStatement2;
                    }else if(thenStatement2.Status == 'Successful') {
                        result = true;
                    }
                }catch(err) {
                    console.log(err);
                }finally {
                    console.log(result);
                }
            }else {
                console.log(!pass);
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