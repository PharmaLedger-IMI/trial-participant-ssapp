const commonServices = require("common-services");
const {Constants,momentService}  = commonServices;

const {WebcController} = WebCardinal.controllers;

let getInitModel = () => {
    return {
        startDate: {
            label: 'Start date',
            name: 'startDate',
            required: true,
            placeholder: 'Please set the start date ',
            min: momentService(new Date()).format(Constants.DATE_UTILS.FORMATS.YearMonthDayPattern),
            value: '',
        },
        endDate: {
            label: 'End date',
            name: 'endDate',
            required: true,
            placeholder: 'Please set the end recruitment date ',
            value: '',
        }

    };
};

export default class RescheduleInvitationController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel(getInitModel());
        this._initHandlers();
        this.model.recruitmentPeriod = props[0].recruitmentPeriod;
        if (this.model.recruitmentPeriod){
            this.model.startDate.value= this.model.recruitmentPeriod.startDate;
            this.model.endDate.value= this.model.recruitmentPeriod.endDate;
        }
    }

    _initHandlers() {
        this._attachHandlerSubmit();

        let recruitmentPeriodHandler = () => {
            let startDate = this.model.startDate.value;
            let endDate =  this.model.endDate.value;

            let fromDateObj = new Date(startDate);
            let toDateObj = new Date(endDate);

            if (fromDateObj > toDateObj || !(toDateObj instanceof Date)) {
                this.model.endDate.value = startDate;
            }
            this.model.endDate.min = momentService(startDate).format(Constants.DATE_UTILS.FORMATS.YearMonthDayPattern);
        };


        this.model.onChange('startDate', recruitmentPeriodHandler);
    }

    _attachHandlerSubmit() {
        this.onTagEvent('tp:submit', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.send('confirmed', {startDate: this.model.startDate.value, endDate: this.model.endDate.value});
        });
    }
}
