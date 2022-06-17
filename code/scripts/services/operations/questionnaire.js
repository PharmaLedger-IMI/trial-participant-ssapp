const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const QuestionnaireService = commonServices.QuestionnaireService;
const questionnaireService = new QuestionnaireService();
const QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS);

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

function _updateQuestion(data) {
    if (data.question) {
        QuestionsRepository.update(data.question.pk, data.question, () => {
        })
    }
}

export { question_response, clinical_site_questionnaire }