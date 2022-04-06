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
        this.model = this.getDaysModel();
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
                    value: i
                });
            } else {
                days.push({
                    month: this.months[this.date.getMonth()],
                    value: i
                });
            }
        }

        for (let j = 1; j <= nextDays; j++) {
            days.push({
                type : "next",
                disabled: true,
                value: j
            });
        }
        return{
            monthName: this.months[this.date.getMonth()],
            fullYear: this.date.getFullYear(),
            days: days
        }
    };
}

export {CalendarController}






