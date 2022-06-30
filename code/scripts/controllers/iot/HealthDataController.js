const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class HealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        const prevState = this.getState() || {};
        var data =  prevState[0];
        console.log("Health Controller");
        console.log(data);
       this.model.healthData = [];
        this.model.hasValue = data.hasValue;
        if(data){
            for(let i=0; i<data.length; i++){
                let data1 = data[i];
                let fullDateTime1 = data1.effectiveDateTime;
                let dateTime1 =  fullDateTime1.split("T");
                let time1 = dateTime1[1].split(".");
                this.model.healthData.push({
                    title: data1.code.text,
                    value: data1.valueQuantity.value,
                    unit: data1.valueQuantity.unit,
                    date: dateTime1[0],
                    time: time1[0]
                });
            }
            
            console.log(this.model.healthData);
        }
        
        this._attachHandlerGoBack();
    }
    _attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.navigateToPageTag('iot-data-selection');
        });
    }

}
