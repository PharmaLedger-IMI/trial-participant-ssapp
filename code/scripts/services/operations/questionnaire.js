import { saveNotification } from './commons/index.js';
const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const QuestionnaireService = commonServices.QuestionnaireService;
const Constants = commonServices.Constants;
const questionnaireService = new QuestionnaireService();

async function clinical_site_questionnaire(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.CLINICAL_SITE_QUESTIONNAIRE);
    questionnaireService.mount(data.ssi, (err, questionnaire) => {
        if (err) {
            console.log(err);
        }
        console.log('questionnaire', questionnaire)
    });
}


export { clinical_site_questionnaire }