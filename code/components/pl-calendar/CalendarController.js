import TaskService from "../../scripts/services/TaskService.js";

const { WebcController } = WebCardinal.controllers;

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
        this.model.isLoading = true;
        this.initCalendar();

        this.initTaskList((err) => {
            if(err) {
                return console.error(err);
            }
            let calendarData = this.getDaysModel();
            this.model.monthName = calendarData.monthName;
            this.model.fullYear = calendarData.fullYear;
            this.model.isLoading = false;
        });

        window.addEventListener("new-task", (event) => {
            const response = event.detail;
            if(response) {
                this.model.isLoading = true;
                this.initTaskList((err) => {
                    if(err) {
                        return console.error(err);
                    }
                    this.initCalendar();
                    let calendarData = this.getDaysModel();
                    this.model.monthName = calendarData.monthName;
                    this.model.fullYear = calendarData.fullYear;
                    this.model.isLoading = false;
                });
            }
        }, {capture: true});

    }

    initTaskList(callback){
        this.taskService.getTasks((err, tasks) => {
            if(err) {
                return console.error(err);
            }
            this.model.visits = tasks.item;
            callback(undefined, this.model.visits);
        });
    }

    _attachHandlerPrev(){
        this.model.isLoading = true;
        this.onTagEvent("calendar:prev", "click", () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.initCalendar();

            let calendarData = this.getDaysModel();
            this.model.monthName = calendarData.monthName;
            this.model.fullYear = calendarData.fullYear;
            this.model.isLoading = false;
        });
    }

    _attachHandlerNext(){
        this.model.isLoading = true;
        this.onTagEvent("calendar:next", "click", () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.initCalendar();

            let calendarData = this.getDaysModel();
            this.model.monthName = calendarData.monthName;
            this.model.fullYear = calendarData.fullYear;
            this.model.isLoading = false;
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
        let visits = this.model.toObject('visits');

        if(visits) {
            this.model.days.forEach(day => {
                let calendarDate = new Date(`${day.value} ${day.month} ${day.year}`);
                calendarDate.setHours(0,0,0,0);

                for(let visit of visits) {
                    let visitDate = new Date(visit.schedule.startDate);
                    visitDate.setHours(0,0,0,0);
                    if (visitDate.getTime() === calendarDate.getTime()) {
                        day.dayType = 'visit';
                    }
                }
            })
        }

        return {
            monthName: this.months[this.date.getMonth()],
            fullYear: this.date.getFullYear(),
        };
    };
}

export {CalendarController}






