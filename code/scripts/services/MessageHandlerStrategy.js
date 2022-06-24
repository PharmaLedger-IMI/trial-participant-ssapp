import * as operations from './operations/index.js';

export default function (operationsRegistry){

    return async function messageHandlerStrategy(message) {

    try {
        message = JSON.parse(message);
        console.log('MESSAGE' , message);
    } catch (e) {
        console.error(e);
        throw e;
    }

    if (typeof operations[message.operation] === "function") {
        const operationResult = operations[message.operation](message);
        if(operationResult instanceof Promise) {
            operationResult.then(result => {
                if(operationsRegistry.hasRegistry(message.operation)) {
                    operationsRegistry.getRegistry(message.operation)(undefined,result);
                }
            }).catch(err => {

                if(operationsRegistry.hasRegistry(message.operation)) {
                    operationsRegistry.getRegistry(message.operation)(err);
                }
            } )
        }

    } else {
        console.log("*******************************");
        console.log(`Received message from ${message.senderIdentity}`);
        console.log("*******************************");
        message.operation = "Could not handle message. Unknown operation";
    }
}
}