import Questionnaire from "../../models/iot/QuestionnairePromPrem.js";

const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class PremService extends DSUService {

    constructor() {
        super('/prem');
    }

    getPrems = (callback) => {

        this.getEntities((err, entities) => {
            if (err) {
                return callback(err);
            }

            if (entities.length > 0) {
                return callback(err, entities[0])
            }

            this.savePrem(Questionnaire.prem, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                callback(err, data);
            })
        });


    }

    savePrem = (data, callback) => this.saveEntity(data, callback);
}