const {WebcController} = WebCardinal.controllers;

export default class VisitDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel({
            ...this.history.win.history.state.state,
        });

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
