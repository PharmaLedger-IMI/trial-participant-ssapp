const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;

const { WebcController } = WebCardinal.controllers;

export default class QuestionsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel({});
        this._initServices();
        this._attachQuestionNavigationHandler();
        this._initQuestions();
        this._attachHandlerBack();
    }

    _initServices() {
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS, this.DSUStorage);
    }

    _initQuestions() {
        this.model.questions = [];
        this.QuestionsRepository.findAll((err, data) => {
            if (err) {
                return console.log(err);
            }

            this.model.questions.push(...data);
        });
    }

    _attachQuestionNavigationHandler() {
        this.onTagEvent('go-to-question', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('question', model.uid);
        });
    }
    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.history.goBack();
        });
    }
}
