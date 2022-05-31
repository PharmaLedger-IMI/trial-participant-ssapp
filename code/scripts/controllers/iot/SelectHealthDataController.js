const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class SelectHealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        // this.initServices();
        this.healthDataService = new HealthDataService();
        this.model.header = "Select IoT Health Data";
        this.model = this.getSelectHealthDataViewModel();
        this.onTagClick("view-iot-data",()=>{
            this.healthDataService.getAllObservations((err, data)=>{
                var result = data[0];
                var selected = this.model.selectObservation.value;
                var pageValue = [];
                console.log(result)
                console.log(selected)
                if(selected == "SpO2"){
                    pageValue.push(result[0]);
                }
                else if(selected == "DiaBP"){
                    pageValue.push(result[1]);
                }
                else if(selected == "SysBP"){
                    pageValue.push(result[2]);
                }
                else if(selected == "Age"){
                    pageValue.push(result[3]);
                }
                else if(selected == "Weight"){
                    pageValue.push(result[4]);
                }
                else if(selected == "Height"){
                    pageValue.push(result[5]);
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
                        value: 'SysBP'
                    },
                    {
                        label: "Diastolic Blood Pressure",
                        value: 'DiaBP'
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
