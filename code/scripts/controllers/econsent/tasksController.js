const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const DateTimeService  = commonServices.DateTimeService;
const { WebcController } = WebCardinal.controllers;
import TaskService from "../../services/TaskService";

export default class eDiaryController extends WebcController {

    prevState = this.getState() || {};
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this._attachHandlerBack();
        this._attachHandlerPREM();
        //this._attachHandlerPROM();
        this.TaskService = new TaskService();
        this.renderPage();
        this.model.today = this.prevState[2];
        console.log(this.model.today);
    }

    renderPage(){
        this.querySelector(".date h3").innerHTML = this.prevState[0] + " " + this.prevState[1];
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('eDiary');
        });
    }

    _attachHandlerPREM() {
        this.onTagClick('navigation:go-prem', () => {
            this.navigateToPageTag('iot-questionnaire');
        });
    }
/*
    _attachHandlerPROM() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('home');
        });
    }

 */
}