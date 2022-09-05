const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const Constants = commonServices.Constants;
const momentService = commonServices.momentService;

export default class VisitDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {
            ...this.getState()
        };

        this.model.visits.forEach(visit=>{
            if (typeof visit.accepted === "undefined" && typeof visit.declined === "undefined" && typeof visit.rescheduled === "undefined") {
                visit.pending = true;
            }
        })
        this.model.visits = this.model.visits.filter((visit) => {
            return visit.uid !== this.model.uid
        })

        if(this.model.schedule.startDate) {
            this.model.toShowDate = momentService(this.model.schedule.startDate).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
        }
        this._initHandlers();
    }

    _initHandlers() {
        this._attachHandlerBack();
        this._attachHandlerProcedures();
    }

    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();
        });
    }

    _attachHandlerProcedures() {
        this.onTagClick('navigate:procedures', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            let details = this.model.toObject('details');
            let info = {
                procedures: details.procedures
            }
            this.navigateToPageTag('procedures-view', info);
        });
    }
}
