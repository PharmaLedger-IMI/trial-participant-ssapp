const commonServices = require('common-services');
const {WebcController} = WebCardinal.controllers;
 import TaskService from "../../services/TaskService.js";
const {QuestionnaireService} = commonServices;


export default class eDiaryController extends WebcController {

    constructor(...props) {
        super(...props);
        this._attachHandlerBack();
        this._attachHandlerPREMAndPROM();
        this._attachHandlerVisitDetails();
        this.taskService = TaskService.getTaskService();

        this.QuestionnaireService = new QuestionnaireService();
        this.model = this.getDefaultModel();
        this.initTaskList();
        this.initQuestionsList();

        if (this.model.today === false) {
            this.model.premdisable = true;
            this.model.promdisable = true;
        }
        else {
            this.model.promdisable = false;
            this.model.premdisable = false;
        }

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
            startDate.setHours(0,0,0,0);
            const endDate = new Date(tasksItemList[i].schedule.endDate);
            endDate.setHours(0,0,0,0);
            const clickedDate = new Date(`${year} ${months.indexOf(month)+1} ${day}`);
            clickedDate.setHours(0,0,0,0);
            const frequencyType = tasksItemList[i].schedule.frequencyType;

            if((clickedDate.getTime() >= startDate.getTime()) && (clickedDate.getTime() <= endDate.getTime())){
                switch (frequencyType) {
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

    initQuestionsList(){
        this.QuestionnaireService.getAllQuestionnaires((err, data) => {
            if (err) {
                return reject(err);
            }
            this.model.questionnaire = data[0];
            if(data[0]) {
                this.renderQuestionnaire();
            }
        })
    }

    renderQuestionnaire(){
        this.model.showProms = false;
        this.model.showPrems = false;
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const {day, month, year} = this.model;
        let startDate = new Date(this.model.questionnaire.schedule.startDate)
        startDate.setHours(0,0,0);
        let endDate = new Date(this.model.questionnaire.schedule.endDate)
        endDate.setHours(0,0,0);
        let clickedDate = new Date(year, months.indexOf(month), day)
        let frequencyType = this.model.questionnaire.schedule.frequencyType;
        if((clickedDate >= startDate) && (clickedDate <= endDate)){
            switch (frequencyType) {
                case "weekly":
                    if(this.isInteger(((clickedDate-startDate)/(7*1000 * 60 * 60 * 24)))){
                        if (this.model.questionnaire.prom.length>0) this.model.showProms=true;
                        if (this.model.questionnaire.prem.length>0) this.model.showPrems=true;
                    }
                    break;
                case "monthly":
                    let monthlyDaysBetween = Math.round((clickedDate - startDate) / (1000 * 24 * 3600))
                    let endOfPreviousMonth = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), 0);
                    let endOfStartDateMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

                    if (endOfPreviousMonth > endOfStartDateMonth) {
                        monthlyDaysBetween -= Math.round((endOfPreviousMonth - endOfStartDateMonth) / (1000 * 24 * 3600))
                    }
                    let calendarMonthDays = new Date(clickedDate.getFullYear(), clickedDate.getMonth() + 1, 0).getDate();

                    if (monthlyDaysBetween % calendarMonthDays === 0) {
                        if (this.model.questionnaire.prom.length>0) this.model.showProms=true;
                        if (this.model.questionnaire.prem.length>0) this.model.showPrems=true;
                    }
                    break;
                case "daily":
                    if (this.model.questionnaire.prom.length>0) this.model.showProms=true;
                    if (this.model.questionnaire.prem.length>0) this.model.showPrems=true;
                    break;
                case "yearly":
                    if(startDate.getDate().valueOf()===clickedDate.getDate().valueOf() && startDate.getMonth()===clickedDate.getMonth()){
                        if (this.model.questionnaire.prom.length>0) this.model.showProms=true;
                        if (this.model.questionnaire.prem.length>0) this.model.showPrems=true;
                    }
                    break;
            }
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
            const {month, day, year, today, visits} = this.model.toObject();
            let visitsInfo = {
                ...model,
                month, day, year, today, visits
            }
            this.navigateToPageTag('visit-details', visitsInfo);
        });
    }

    _attachHandlerPREMAndPROM() {

        const navigateToEdiary = (title, questionnaireType)=>{
            if (this.model.today === false) {
                return;
            }
            const {month, day, year, today, visits} = this.model.toObject();
            this.navigateToPageTag("ediary", {
                type: questionnaireType,
                title: title,
                month, day, year, today, visits
            });
        }


        this.onTagClick("navigate:ediary-prom", () => {
            navigateToEdiary("Health questions", "prom");
        });

        this.onTagClick("navigate:ediary-prem", () => {
            navigateToEdiary("Rate your experience", "prem");
        });
    }

    getDefaultModel() {
        const prevState = this.getState() || {};
        return {
            ...prevState,
            tasks: []
        }
    }

}