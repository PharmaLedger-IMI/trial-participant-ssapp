const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class HealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        const prevState = this.getState() || {};
        var data =  prevState[0];
        if(data){
            this.model.title = data.code.text;
            this.model.value = data.valueQuantity.value;
            this.model.unit = data.valueQuantity.unit;
        }
        
        this._attachHandlerGoBack();
    }
    _attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.navigateToPageTag('iot-data-selection');
        });
    }

}
