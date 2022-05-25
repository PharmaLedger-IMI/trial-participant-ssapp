const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

class TPService extends DSUService {

    constructor() {
        super('/tp');
        this.tp = null;
    }

    getTp(callback) {
        if(this.tp){
            return callback(undefined, this.tp);
        }
        this.getEntities((err, tpDSUs) => {
            if (err) {
                return callback(err)
            }
            if(tpDSUs.length === 0){
                return callback(new Error("No tp set yet."));
            }
            this.tp = tpDSUs[0];
            callback(undefined, this.tp);
        })
    }

    mountTp(tpSSI, callback) {
        this.mountEntity(tpSSI, (err, mountedTp) => {
            if (err) {
                return callback(err);
            }
            this.tp = mountedTp;
            callback(undefined, this.tp);
        });
    }

    createTp(tpData, callback){
        this.saveEntity(tpData, callback);
    }

    updateTp(tp, callback){
        this.updateEntity(tp, callback)
    }
   async updateTpAsync(tp){
       return this.asyncMyFunction(this.updateTp, [...arguments]);
    }
    async createTpAsync(tp){
        return this.asyncMyFunction(this.createTp, [...arguments]);
    }
}

let instance = null

export const getTPService = ()=>{
    if (!instance) {
        instance = new TPService();
    }
    return instance
}
