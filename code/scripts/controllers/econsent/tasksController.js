const commonServices = require('common-services');
const {WebcController} = WebCardinal.controllers;
import TaskService from "../../services/TaskService.js";
import {getTestTaskModel} from "../../models/TaskModel.js"

export default class eDiaryController extends WebcController {

    constructor(...props) {
        super(...props);
        this._attachHandlerBack();
        this._attachHandlerPREMAndPROM();
        this._attachHandlerVisitDetails();
        this.taskService = TaskService.getTaskService();
        this.model = this.getDefaultModel();
        this.initTaskList();
    }

    initTaskList(){
        this.taskService.getTasks((err, tasksList) => {
            if(err){
                return console.error(err);
            }
            this.renderTasks(tasksList.item);
        });
    }

    renderTasks(tasks){
        this.model.tasks = tasks;
        this.model.tasksLoaded = true;
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for(let i = 0; i < this.model.tasks.length; i++){

            const tasksItemList = this.model.toObject("tasks");
            const {day, month, year} = this.model;

            const startDate = new Date(tasksItemList[i].schedule.startDate);
            const endDate = new Date(tasksItemList[i].schedule.endDate);
            const clickedDate = new Date(year, months.indexOf(month), day);
            const repeatAppointment = tasksItemList[i].schedule.repeatAppointment;

            if((clickedDate >= startDate) && (clickedDate <= endDate)){
                switch (repeatAppointment) {
                    case "weekly":
                        if(this.isInteger(((clickedDate-startDate)/(7*1000 * 60 * 60 * 24)))){
                            tasksItemList[i].showTask = true;
                        }
                        break;
                    case "monthly":
                        if(startDate.getDate().valueOf()===clickedDate.getDate().valueOf()){
                            tasksItemList[i].showTask = true;
                        }
                        break;
                    case "daily":
                        tasksItemList[i].showTask = true;
                        break;
                }

            } else {
                tasksItemList[i].showTask = false;
            }

            this.model.tasks = JSON.parse(JSON.stringify(tasksItemList));

        }
    }

    isInteger (num){
        return num % 1 === 0;
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('task-calendar');
        });
    }

    _attachHandlerVisitDetails() {
        this.onTagClick('visit-details', (model) => {
            let visitsInfo = {
                ...model,
                visits: this.model.toObject('visits')
            }
            this.navigateToPageTag('visit-details', visitsInfo);
        });
    }

    _attachHandlerPREMAndPROM() {
        this.onTagClick("navigate:ediary-prom", () => {
            if (this.model.today === false) {
                return;
            }
            this.navigateToPageTag("ediary-prom");
        })
        this.onTagClick("navigate:ediary-prem", () => {
            if (this.model.today === false) {
                return;
            }
            this.navigateToPageTag("ediary-prem");
        })
    }

    getDefaultModel() {
        const prevState = this.getState() || {};
        return {
            ...prevState,
            tasks: []
        }
    }

}