class OperationsHookRegistry {
    constructor() {
        this.registry = {};
    }

    hasRegistry(operation) {
        return this.registry.hasOwnProperty(operation);
    }

    getRegistry(operation) {
        return this.registry[operation];
    }

    register(name, entry) {
        this.registry[name] = entry;
    }
}

let instance;
export const getOperationsHookRegistry = ()=> {
    if (!instance) {
        instance = new OperationsHookRegistry();
    }
    return instance
}
