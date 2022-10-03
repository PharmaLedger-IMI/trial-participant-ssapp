import * as operations from './operations/index.js';
const loader = window.WebCardinal.loader;
let currentTimeout = null;
export default function (operationsRegistry){

    return async function messageHandlerStrategy(message) {

    const onConfirmRefresh = function (event) {
        event.preventDefault();
        return event.returnValue = "Are you sure you want to leave?";
    }

    const blockUI = () =>{

        if(currentTimeout){
            loader.removeAttribute("completed");
        }

        loader.hidden = false;
        loader.setAttribute("data-value","Updating wallet. Please wait...")
        window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });
    }

    const unBlockUI = ()=>{

        loader.setAttribute("data-value", "Update successfully completed");
        loader.setAttribute("completed","");
        currentTimeout = setTimeout(() => {
            loader.removeAttribute("data-value");
            loader.removeAttribute("completed");
            loader.hidden = true;
            currentTimeout = null;
        } ,2000)

        window.removeEventListener("beforeunload", onConfirmRefresh, { capture: true });
    }


    try {
        message = JSON.parse(message);
        console.log('MESSAGE' , message);
    } catch (e) {
        console.error(e);
        throw e;
    }

    if (typeof operations[message.operation] === "function") {

        blockUI();

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
                unBlockUI();

            }
            catch (err) {
                await callHookFn(err);
                unBlockUI();
            }
        }
        else{
            unBlockUI();
        }

    } else {
        console.log("*******************************");
        console.log(`Received message from ${message.senderIdentity}`);
        console.log("*******************************");
        message.operation = "Could not handle message. Unknown operation";
    }
}
}