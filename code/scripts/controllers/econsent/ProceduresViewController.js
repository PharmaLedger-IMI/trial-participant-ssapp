const {WebcController} = WebCardinal.controllers;

export default class ProceduresViewController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel({
            ...this.getState(),
        });

        this._attachHandlerBack();
    }

    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();
        });
    }


}
