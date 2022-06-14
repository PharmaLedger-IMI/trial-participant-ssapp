import { _updateQuestion } from "./commons/index.js";
const commonServices = require('common-services');
const QuestionnaireService = commonServices.QuestionnaireService;
const questionnaireService = new QuestionnaireService();

function question_response(data) {
    _updateQuestion(data.useCaseSpecifics);
}

function clinical_site_questionnaire(data) {
    questionnaireService.mount(data.ssi, (err, questionnaire) => {
        if (err) {
            console.log(err);
        }
        console.log('questionnaire', questionnaire)
    });
}

export { question_response, clinical_site_questionnaire }