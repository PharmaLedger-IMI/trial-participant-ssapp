const { WebcController } = WebCardinal.controllers;

class CalendarController extends WebcController {
    constructor(...props) {
        super(...props);
        this.date = new Date();
        this.renderCalendar();
        this._attachHandlerPrev();
        this._attachHandlerNext();
    }

    _attachHandlerPrev(){
        this.onTagEvent("calendar:prev", "click", () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.renderCalendar();
        });
    }
    _attachHandlerNext(){
        this.onTagEvent("calendar:next", "click", () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.renderCalendar();
        });
    }


    renderCalendar(){

        this.date.setDate(1);

        const monthDays = this.querySelector(".days");

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

        const months = [
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

        this.querySelector(".date h1").innerHTML = months[this.date.getMonth()];

        this.querySelector(".date p").innerHTML = this.date.getFullYear();

        let days = "";

        for (let x = firstDayIndex; x > 0; x--) {
            days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
        }


        for (let i = 1; i <= lastDay; i++) {
            if (
                i === new Date().getDate() &&
                this.date.getMonth() === new Date().getMonth() &&
                this.date.getFullYear() === new Date().getFullYear()
            ) {
                days += `<div data-tag="day" class="today" id=${months[this.date.getMonth()]}>${i}</div>`;
            } else {
                days += `<div data-tag="day" id=${months[this.date.getMonth()]}>${i}</div>`;
            }
        }

        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="next-date">${j}</div>`;
            //monthDays.innerHTML = days;
        }
        monthDays.innerHTML = days;
    };

}

export {CalendarController}






