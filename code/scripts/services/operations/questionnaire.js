import { saveNotification } from './commons/index.js';
const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const QuestionnaireService = commonServices.QuestionnaireService;
const Constants = commonServices.Constants;
const questionnaireService = new QuestionnaireService();
const QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS);

async function question_response(data) {
    await saveNotification(data, Constants.MESSAGES.HCO.COMMUNICATION.TYPE.QUESTION_RESPONSE);
    _updateQuestion(data.useCaseSpecifics);
}

async function clinical_site_questionnaire(data) {
    await saveNotification(data, Constants.MESSAGES.HCO.CLINICAL_SITE_QUESTIONNAIRE);
    questionnaireService.mount(data.ssi, (err, questionnaire) => {
        if (err) {
            console.log(err);
        }
        console.log('questionnaire', questionnaire)
    });
}

function _updateQuestion(data) {
    if (data.question) {
        QuestionsRepository.update(data.question.pk, data.question, () => {
        })
    }
}

export { question_response, clinical_site_questionnaire }