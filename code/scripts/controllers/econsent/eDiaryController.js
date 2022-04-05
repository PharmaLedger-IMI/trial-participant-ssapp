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
        this.onTagClick('day', () => {
            const day = event.path[0].innerHTML;
            const month = event.path[0].id;
            let today = false;
            const date = event.path[0].className;
            if(date == "today"){
                today = true;
            }
            let info = {
                month, day, today
            };

            this.navigateToPageTag('econsent-tasks', info);
        });
    }


}