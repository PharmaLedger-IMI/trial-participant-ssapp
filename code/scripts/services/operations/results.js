import { saveNotification } from './commons/index.js';
const commonServices = require("common-services")
const { ResultsService } = commonServices;
const Constants = commonServices.Constants;
const resultsService = new ResultsService();

export async function new_result(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_RESULT);
    resultsService.mount(data.ssi, (err, data) => {
        if (err) {
            return console.error(err);
        }
        resultsService.getResults((err, results) => {
            if (err) {
                return console.error(err);
            }
            console.log('results', results)
        });
    })
}