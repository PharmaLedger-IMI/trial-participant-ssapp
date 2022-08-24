import TaskService from "../../scripts/services/TaskService.js";
const commonServices = require('common-services');
const { WebcController } = WebCardinal.controllers;
const {QuestionnaireService} = commonServices;

class CalendarController extends WebcController {

    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    constructor(...props) {
        super(...props);
        this.date = new Date();
        this._attachHandlerPrev();
        this._attachHandlerNext();

        this.taskService =  TaskService.getTaskService();
        this.QuestionnaireService = new QuestionnaireService();
        this.model.isLoading = true;
        this.initCalendar();

        this.initTaskList((err, visits) => {
            if(err) {
                return console.error(err);
            }

            this.visits = visits;

            this.QuestionnaireService.getAllQuestionnaires((err, data) => {
                if (err) {
                    return reject(err);
                }
                this.questionnaire = data[0];

                if(this.questionnaire){
                    let startDate = new Date(this.questionnaire.schedule.startDate)
                    startDate.setHours(0,0,0);
                    let endDate = new Date(this.questionnaire.schedule.endDate)
                    endDate.setHours(0,0,0);
                    let frequencyType = this.questionnaire.schedule.frequencyType;

                    this.questionnaireDates = {
                        startDate,endDate,frequencyType
                    }

                }
                this._setCalendarDate();

            })


        });
    }

    initTaskList(callback){
        this.taskService.getTasks((err, tasks) => {
            if(err) {
                return console.error(err);
            }
            callback(undefined, tasks.item);
        });
    }


    _initMonth(monthPosition){
        this.model.isLoading = true;
        this.date.setMonth(this.date.getMonth() + monthPosition);
        this.initCalendar();
        this._setCalendarDate();
    }

    _setCalendarDate() {
        let calendarData = this.getDaysModel();
        this.model.monthName = calendarData.monthName;
        this.model.fullYear = calendarData.fullYear;
        this.model.isLoading = false;
    }

    _attachHandlerPrev(){
        this.onTagEvent("calendar:prev", "click", () => {
            this._initMonth(-1)
        });
    }

    _attachHandlerNext(){
        this.onTagEvent("calendar:next", "click", () => {
            this._initMonth(1)
        });
    }

    initCalendar() {
        this.date.setDate(1);

        const lastDay = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            0
        ).getDate();

        const prevLastDay = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            0
        ).getDate();

        const firstDayIndex = this.date.getDay();

        const lastDayIndex = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            0
        ).getDay();

        const nextDays = 7 - lastDayIndex - 1;

        let days = [];

        for (let x = firstDayIndex; x > 0; x--) {
            days.push({
                type : "prev",
                disabled: true,
                value: prevLastDay - x + 1
            });
        }

        for (let i = 1; i <= lastDay; i++) {
            if (
                i === new Date().getDate() &&
                this.date.getMonth() === new Date().getMonth() &&
                this.date.getFullYear() === new Date().getFullYear()
            ) {
                days.push({
                    type: "today",
                    month: this.months[this.date.getMonth()],
                    year: this.date.getFullYear(),
                    value: i
                });
            } else {
                days.push({
                    month: this.months[this.date.getMonth()],
                    year: this.date.getFullYear(),
                    value: i
                });
            }
        }

        for (let j = 1; j <= nextDays; j++) {
            days.push({
                type : "next",
                disabled: true,
                value: j,
                year: this.date.getMonth() < 11 ? this.date.getFullYear() : this.date.getFullYear()+1,
                month: this.months[(this.date.getMonth()+1)%12]
            });
        }

        this.model.days = days;
    }

    getDaysModel(){


        this.model.days.forEach(day => {
            if (this.visits) {
                let calendarDate = new Date(`${day.value} ${day.month} ${day.year}`);
                calendarDate.setHours(0, 0, 0, 0);

                for (let visit of this.visits) {
                    let visitDate = new Date(visit.schedule.startDate);
                    visitDate.setHours(0, 0, 0, 0);
                    if (visitDate.getTime() === calendarDate.getTime()) {
                        day.dayType = 'visit';
                    }
                }


            day.promType = false;
            day.premType = false
            if (this.questionnaireDates) {
                if (this.questionnaireDates.startDate <= calendarDate && calendarDate <= this.questionnaireDates.endDate) {
                    let hasQuestionnaire = false;
                    switch (this.questionnaireDates.frequencyType) {
                        case "daily":
                            hasQuestionnaire = true;
                        break;
                        case "weekly":
                            let weeklyDaysBetween = Math.round((calendarDate - this.questionnaireDates.startDate)/(1000*24*3600))
                            if (weeklyDaysBetween % 7 === 0) {
                                hasQuestionnaire = true;
                            }
                            break;
                        case "monthly":
                            let monthlyDaysBetween = Math.round((calendarDate - this.questionnaireDates.startDate) / (1000 * 24 * 3600))
                            let endOfPreviousMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0);
                            let endOfStartDateMonth = new Date(this.questionnaireDates.startDate.getFullYear(), this.questionnaireDates.startDate.getMonth() + 1, 0);

                            if (endOfPreviousMonth > endOfStartDateMonth) {
                                monthlyDaysBetween -= Math.round((endOfPreviousMonth - endOfStartDateMonth) / (1000 * 24 * 3600))
                            }
                            let calendarMonthDays = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();

                            if (monthlyDaysBetween % calendarMonthDays === 0) {
                                hasQuestionnaire = true;
                            }
                            break;
                        case "yearly":
                            const dateCopy = new Date(this.questionnaireDates.startDate.getTime());
                            dateCopy.setFullYear(calendarDate.getFullYear());
                            if(calendarDate.valueOf() === dateCopy.valueOf()){
                                hasQuestionnaire = true;

                            }
                            break;
                    }

                    if (hasQuestionnaire) {
                        day.promType = this.questionnaire.prom.length > 0
                        day.premType = this.questionnaire.prem.length > 0
                    }

                }
            }

            }
        })


        return {
            monthName: this.months[this.date.getMonth()],
            fullYear: this.date.getFullYear(),
        };
    };
}

export {CalendarController}






