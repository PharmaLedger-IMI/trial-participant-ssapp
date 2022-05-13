const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const DateTimeService  = commonServices.DateTimeService;
const { WebcController } = WebCardinal.controllers;
const {QuestionnaireService} = commonServices;


export default class TaskCalendar extends WebcController {
    constructor(...props) {
        super(...props);
        this._attachHandlerBack();
        this._attachHandlerShowTasks();
        this.QuestionnaireService = new QuestionnaireService();
        this.QuestionnaireService.getAllQuestionnaires((err, data ) => {
            if (err) {
                return reject(err);
            }
            console.log(data[0]);
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerShowTasks(){
        this.onTagClick('day', (model) => {
            if(model.disabled === true){
                return;
            }
            let info = {
                month: model.month,
                day: model.value,
                year: model.year,
                today: model.type === "today"
            };
            console.log(model);
            this.navigateToPageTag('econsent-tasks', info);
        });
    }


}