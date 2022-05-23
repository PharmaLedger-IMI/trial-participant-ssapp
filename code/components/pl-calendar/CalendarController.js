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
        this.initTaskList((err,invitations) => {
            if(err) {
                return console.error(err);
            }
            this.model = this.getDaysModel();
        });

        window.addEventListener("new-task", (event) => {
            const response = event.detail;
            console.log('response',response)
            if(response) {
                this.initTaskList((err,invitations) => {
                    if(err) {
                        return console.error(err);
                    }
                    this.model = this.getDaysModel();
                });
            }
        }, {capture: true});

    }

    initTaskList(callback){
        this.taskService.getTasks((err, tasks) => {
            if(err) {
                return console.error(err);
            }
            this.model.invitations = tasks.item;
            callback(undefined, this.model.invitations);
        });
    }

    _attachHandlerPrev(){
        this.onTagEvent("calendar:prev", "click", () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.model = this.getDaysModel();
        });
    }
    _attachHandlerNext(){
        this.onTagEvent("calendar:next", "click", () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.model = this.getDaysModel();
        });
    }


    getDaysModel(){

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

        let invitations = this.model.toObject('invitations');
        console.log('invitations',invitations);

        if(invitations) {
            days.forEach(day => {
                let calendarDate = Date.parse(`${day.value} ${day.month} ${day.year}`);
                for(let invitation of invitations) {
                    let visitDate = new Date(invitation.schedule.startDate).getTime();
                    if (visitDate === calendarDate) {
                        day.dayType = 'invitation'; // modify to visit
                    }
                }
            })
        }

        console.log('days',days)

        return{
            monthName: this.months[this.date.getMonth()],
            fullYear: this.date.getFullYear(),
            days: days
        }
    };
}

export {CalendarController}






