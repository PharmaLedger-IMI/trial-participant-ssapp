const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class SelectHealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        // options = []
        // this.healthDataService.getAllObservations((err, data)=>{
        //     var result = data[0];
            
        // });

        this.healthDataService = new HealthDataService();
        //this.model.header = "Select IoT Health Data";
        this.model = this.getSelectHealthDataViewModel();
        this.onTagClick("view-iot-data",()=>{
            this.healthDataService.getAllObservations((err, data)=>{
                if(err){
                    console.log(err);
                }
                // var pageValue = [];
                // console.log(data);
                // if(data.length>0){
                //     let countData = data.length - 1;
                //     var result = data[countData];
                //     var selected = this.model.selectObservation.value;
                //     console.log(selected)
                //     console.log(this.model.selectObservation.value);
                //     let tempVal =  result.filter(o => o.code.text.includes(selected));
                //     // console.log("This is the Temp Value");
                //     // console.log(tempVal);
                //     pageValue.push(tempVal);
                //     pageValue.push({hasValue:true});

                // }
                var pageValue = [];
                console.log("*************** View IoT Data ***************")
                console.log(data);
                
                if(data.length){
                    // let countData = data.length - 1;
                    for(let i=1; i<data.length;  i++){
                        var result = data[i];
                        // console.log("************* Result: **********");
                        // console.log(result);
                        var selected = this.model.selectObservation.value;
                        let tempVal =  result.filter(o => o.code.text.includes(selected));
                        // console.log("************* Temp Value: **********");
                        // console.log(tempVal);
                        for(let j=0; j<tempVal.length; j++){
                            pageValue.push(tempVal[j]);
                        }
                    }
                    if(pageValue.length){
                        pageValue.push({hasValue:true});
                    }
                    else {
                        pageValue.push({hasValue:false});
                    }
                    
                }
                else {
                    
                    pageValue.push({hasValue:false});
                    console.log("Didn't find any value!");
                }
                console.log(pageValue);
                this.navigateToPageTag('iot-helath-data', pageValue);

            });
            
            
        });
        this._attachHandlerGoBack();
    }
    _attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.navigateToPageTag('home');
        });
    }
    getSelectHealthDataViewModel() {
        return {
            selectObservation: {
                label: "Select type of health data",
                required: true,
                options: [
                    {
                        label: "Systolic Blood Pressure",
                        value: 'Systolic Blood Pressure'
                    },
                    {
                        label: "Diastolic Blood Pressure",
                        value: 'Diastolic Blood Pressure'
                    },
                    {
                        label: "SpO2",
                        value: 'SpO2'
                    },
                    {
                        label: "Age",
                        value: 'Age'
                    },
                    {
                        label: "Height",
                        value: 'Height'
                    },
                    {
                        label: "Weight",
                        value: 'Weight'
                    }
                ],
                value: ""
            }
            
        }
    }

}
