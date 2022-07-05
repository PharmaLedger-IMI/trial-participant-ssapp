const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class HealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        const prevState = this.getState() || {};
        console.log(prevState)
        var data =  prevState[0];
        console.log("Health Controller");
        console.log(data);
       this.model.healthData = [];

       if (prevState[1]) {
           this.model.hasValue = true;
       }
       else {
           this.model.hasValue = false;
       }

        //this.model.hasValue = prevState[1].hasValue;
        console.log(this.model.hasValue);
        if(data.length>0){
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
