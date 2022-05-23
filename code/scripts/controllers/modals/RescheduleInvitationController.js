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
            min: momentService(new Date()).format(Constants.DATE_UTILS.FORMATS.YearMonthDayPattern),
            value: '',
        }
    };
};

export default class RescheduleInvitationController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel(getInitModel());
        this._initHandlers();
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
