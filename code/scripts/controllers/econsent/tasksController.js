const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const DateTimeService  = commonServices.DateTimeService;
const { WebcController } = WebCardinal.controllers;
import TaskService from "../../services/TaskService.js";
import {getTestTaskModel} from "../../models/TaskModel.js"

export default class eDiaryController extends WebcController {

    constructor(...props) {
        super(...props);
        this._attachHandlerBack();
        this._attachHandlerPREM();
        //this._attachHandlerPROM();
        this.TaskService = new TaskService();
        this.model = this.getDefaultModel();
        console.log(this.model.toObject());
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

    getDefaultModel(){
        const prevState = this.getState() || {};
        return{
            tasks: getTestTaskModel(),
            ...prevState
        }
    }
}