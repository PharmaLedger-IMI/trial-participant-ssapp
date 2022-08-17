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

            const callHookFn = async (err, result)=>{
                if(operationsRegistry.hasRegistry(message.operation)) {
                    const registryFn = operationsRegistry.getRegistry(message.operation)(undefined,result);
                    if(registryFn instanceof Promise){
                        await registryFn;
                    }
                }
            }

            try{
                const result = await operationResult;
                await callHookFn(undefined, result);

            }
            catch (err) {
                await callHookFn(err);

            }

        }

    } else {
        console.log("*******************************");
        console.log(`Received message from ${message.senderIdentity}`);
        console.log("*******************************");
        message.operation = "Could not handle message. Unknown operation";
    }
}
}