const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const DateTimeService  = commonServices.DateTimeService;
const { WebcController } = WebCardinal.controllers;

export default class eDiaryController extends WebcController {
    constructor(...props) {
        super(...props);
        this._attachHandlerBack();
        this._attachHandlerShowTasks();
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