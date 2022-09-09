import { saveNotification } from './commons/index.js';
const commonServices = require("common-services")
const { ResultsService } = commonServices;
const Constants = commonServices.Constants;
const resultsService = new ResultsService();

export async function new_result(data) {
    resultsService.mount(data.ssi, async (err, data) => {
        if (err) {
            return console.error(err);
        }
        const notificationTitle = `${Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_RESULT.notificationTitle} for ${data.studyTitle}`;
        let notificationInfo = {
            ...Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_FEEDBACK,
            notificationTitle: notificationTitle
        }
        await saveNotification(data, notificationInfo);
        resultsService.getResults((err, results) => {
            if (err) {
                return console.error(err);
            }
            console.log('results', results)
        });
    })
}