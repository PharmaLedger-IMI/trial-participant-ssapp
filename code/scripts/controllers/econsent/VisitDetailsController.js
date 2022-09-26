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
            visit.visitDate = (new Date(visit.proposedDate)).toLocaleString();
            if(visit.accepted === true || visit.confirmed === true) {
                return visit.status = 'accepted';
            }
            if(visit.rescheduled === true) {
                return visit.status = 'rescheduled';
            }
            return visit.status = 'pending';
        });

        this.state.visits = this.state.visits.filter((visit) => {
            return visit.uid !== this.state.uid && !visit.declined
        })

        this.model.visits = this.state.visits.sort((a, b) => a.proposedDate - b.proposedDate);

        if(this.state.schedule.startDate) {
            this.model.toShowDate = (new Date(this.state.schedule.startDate)).toLocaleString();
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
