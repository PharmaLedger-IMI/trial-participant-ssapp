const commonServices = require("common-services");
const {Constants,momentService}  = commonServices;

const {WebcController} = WebCardinal.controllers;

let getInitModel = () => {
    return {
        desiredDate: {
            label: 'Desired date',
            name: 'desiredDate',
            required: true,
            placeholder: 'Please set the desired date ',
            value: '',
            min:'',
            max:''
        },
        datesInformation : '',
        haveSuggestedInterval: false,
        isBtnDisabled: false,
    };
};

export default class RescheduleInvitationController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel(getInitModel());
        this._initHandlers();

        if(props[0].suggestedInterval) {
            this.querySelector("#procedure-date").classList.add("is-invalid");
            this.model.haveSuggestedInterval = true;
            let suggestedInterval = props[0].suggestedInterval;

            let firstIntervalDate = (new Date(suggestedInterval[0])).getTime();
            let secondIntervalDate = (new Date(suggestedInterval[1])).getTime();
            let firstDateFormatted = this.getDateTime(firstIntervalDate);
            let secondDateFormatted = this.getDateTime(secondIntervalDate);
            this.model.desiredDate.min = firstDateFormatted.date + 'T' + firstDateFormatted.time;
            this.model.desiredDate.max = secondDateFormatted.date + 'T' + secondDateFormatted.time;

            let from = momentService(props[0].suggestedInterval[0]).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
            let to = momentService(props[0].suggestedInterval[1]).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
            this.model.datesInformation = `Choose a date from: ${from} to ${to}`;
            if(!this.model.desiredDate.value) {
                this.model.isBtnDisabled = true;
            }
            this.model.onChange('desiredDate.value', () => {
                let selectedDate = new Date(this.model.desiredDate.value);
                if(selectedDate.getTime() < suggestedInterval[0] || selectedDate.getTime() > suggestedInterval[1]) {
                    this.model.isBtnDisabled = true;

                } else {
                    this.model.isBtnDisabled = false;
                    this.querySelector("#procedure-date").classList.remove("is-invalid");
                }
            })
        }
    }

    getDateTime(timestamp) {
        return {
            date: momentService(timestamp).format(Constants.DATE_UTILS.FORMATS.YMDDateTimeFormatPattern),
            time: momentService(timestamp).format(Constants.DATE_UTILS.FORMATS.HourFormatPattern)
        };
    }

    _initHandlers() {
        this._attachHandlerSubmit();
    }

    _attachHandlerSubmit() {
        this.onTagEvent('tp:submit', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.send('confirmed', {desiredDate: this.model.desiredDate.value});
        });
    }
}
