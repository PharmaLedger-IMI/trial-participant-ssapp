const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class TrialService extends DSUService {

    constructor() {
        super('/trials');
    }

    getTrials = (callback) => this.getEntities(callback);

    async getTrialsAsync () {
        return this.asyncMyFunction(this.getEntities, [...arguments]);
    }

    getTrial = (uid, callback) => this.getEntity(uid, callback);

    mountTrialAsync = (keySSI) => this.mountEntityAsync(keySSI);

    getEconsent = (trialSSI, econsentSSI, callback) => this.getEntity(econsentSSI, this._getEconsentsPath(trialSSI), callback)

    _getEconsentsPath = (keySSI) => this.PATH + '/' + keySSI + '/consent';

}