const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const Constants = commonServices.Constants;

export default class HealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        const data = this.getState() || {};
        console.log("Health Controller");
        console.log(data);
       this.model.healthData = [];
       this.model.hasHealthData = data.length>0;


        for (let i = 0; i < data.length; i++) {
            let data1 = data[i];
            let fullDateTime1 = data1.effectiveDateTime;
            let dateTime1 = fullDateTime1.split("T");
            let time1 = dateTime1[1].split(".");
            this.model.healthData.push({
                title: data1.code.text,
                value: data1.valueQuantity.value,
                unit: data1.valueQuantity.unit,
                date: (new Date(dateTime1[0])).toLocaleDateString(Constants.DATE_UTILS.FORMATS.EN_UK),
                time: time1[0]
            });
        }

        this._attachHandlerGoBack();
    }
    _attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.navigateToPageTag('iot-data-selection');
        });
    }

}
