const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class EconsentService extends DSUService {

    ECONSENT_PATH = "/econsents";

    constructor() {
        super('/econsents');
    }

    getEconsentsStatuses = (callback) => this.getEntities(callback);

    getEconsentStatus = (uid, callback) => this.getEntity(uid, callback);

    saveEconsent = (data, callback) => this.saveEntity(data, callback);

    saveEconsentAsync = (data, path) => this.saveEntityAsync(data, path);

    saveEconsentFile(file, eco, callback) {
        this.DSUStorage.uploadFile(
            this._getEconsentsFilePath(eco.KeySSI, eco.id),
            file,
            undefined,
            (err, keySSI) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                console.log("The econsent file is saved  ");
                callback(err, data.uid);
            }
        );

    }

    _getEconsentsPath(econsentID) {

        return this.ECONSENT_PATH + '/' + econsentID;
    }

    _getEconsentsFilePath(keySSI, econsentId) {

        return this._getEconsentsPath(econsentId) + '/' + keySSI + '/';
    }

    mountEconsent = (keySSI, callback) => this.mountEntity(keySSI, callback);

    updateEconsent = (data, callback) => this.updateEntity(data, callback);

    unmountEconsent = (uid, callback) => this.unmountEntity(data, callback);
}