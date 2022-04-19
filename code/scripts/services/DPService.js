const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

// NOTE that DP stands for Dynamic Permission
class DPService extends DSUService {

    constructor() {
        super('/dynamic-permision');
    }

    getDP(callback) {
        this.getEntities((err, dp) => {
            if (err) {
                return callback(err)
            }
            let myDP = dp && dp.length > 0 ? dp[0] : undefined
            callback(err, myDP)
        })
    }  

    saveDP(dp, callback) {
        this.saveEntity(dp, callback);
    }

    updateDP(dp, callback) {
        this.updateEntity(dp, callback);
    }
}

let instance = null

const getDPService = ()=>{
    if (!instance) {
        instance = new DPService()
    }
    return instance
}

export default { getDPService }