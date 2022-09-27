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

async function clinical_site_questionnaire_update(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.CLINICAL_SITE_QUESTIONNAIRE_UPDATE);
}

export { clinical_site_questionnaire, clinical_site_questionnaire_update }