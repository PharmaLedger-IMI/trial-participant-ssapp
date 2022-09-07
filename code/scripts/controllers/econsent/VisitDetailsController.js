const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const Constants = commonServices.Constants;
const momentService = commonServices.momentService;

export default class VisitDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.state = {
            ...this.getState()
        };

        this.model.details = this.state.details;

        this.state.visits.forEach(visit=>{
            if (typeof visit.accepted === "undefined" && typeof visit.declined === "undefined" && typeof visit.rescheduled === "undefined" && typeof visit.confirmed==='undefined') {
                visit.pending = true;
            }
        })
        this.state.visits = this.state.visits.filter((visit) => {
            return visit.uid !== this.state.uid
        })

        this.model.visits = this.state.visits.sort((a, b) => a.proposedDate - b.proposedDate);

        if(this.state.schedule.startDate) {
            this.model.toShowDate = momentService(this.state.schedule.startDate).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
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
