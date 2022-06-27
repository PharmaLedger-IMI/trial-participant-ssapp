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
        this.model.header = "Select IoT Health Data";
        this.model = this.getSelectHealthDataViewModel();
        this.onTagClick("view-iot-data",()=>{
            this.healthDataService.getAllObservations((err, data)=>{
                if(err){
                    console.log(err);
                }
                var pageValue = [];
                console.log(data);
                if(data.length){
                    let countData = data.length - 1;
                    var result = data[countData];
                    var selected = this.model.selectObservation.value;
                    console.log(selected)
                    let tempVal =  result.filter(o => o.code.text.includes(selected));
                    pageValue.push(tempVal[0]);
                    pageValue.push({hasValue:false});

                }
                else {
                    
                    pageValue.push({hasValue:true});
                    console.log("Didn't find any value!");
                }
                
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
                label: "Select Health Data",
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
