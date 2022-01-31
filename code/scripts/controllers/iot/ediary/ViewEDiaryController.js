import EDiaryService from "../../../services/iot/EDiaryService.js";
const commonServices = require("common-services");
const {WebcController} = WebCardinal.controllers;

export default class ViewEdiaryController extends WebcController {
    constructor(...props) {
        super(...props);

        let uid = this.history.location.state.uid;
        this.EDiaryService = new EDiaryService();

        this.EDiaryService.getEdiary(uid, (err, data) => {
            if (err) {
                return console.log(err);
            }

            data.stringDate = commonServices.DateTimeService.convertDateToInputValue(new Date(data.date));
            this.model.ediary = data;

        });

        this._addHandlerBack();
    }

    _addHandlerBack() {

        this.onTagClick('ediary:back', () => {
            this.navigateToPageTag('iot-ediary');
        });

    }

}