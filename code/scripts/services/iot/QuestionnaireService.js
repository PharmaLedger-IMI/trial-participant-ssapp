import Questionnaire from "../../models/iot/Questionnaire.js";

const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class QuestionnaireService extends DSUService {

    constructor() {
        super('/questionnaires');
    }

    getQuestionnaires = (callback) => {

        this.getEntities((err, entities) => {
            if (err) {
                return callback(err);
            }

            if (entities.length > 0) {
                return callback(err, entities[0])
            }

            this.saveQuestionnaire(Questionnaire.example, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                callback(err, data);
            })
        });


    }

    saveQuestionnaire = (data, callback) => this.saveEntity(data, callback);
}