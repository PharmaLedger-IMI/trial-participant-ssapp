const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;



export default class SelectHealthDataController extends WebcController {
    constructor(...props) {
        super(...props);

        this.healthDataService = new HealthDataService();
        this.model = this.getSelectHealthDataViewModel();
        this.onTagClick("view-iot-data",()=>{
            this.healthDataService.getAllObservations((err, observationsDSUs)=>{
                if(err){
                    console.log(err);
                }

                let patientObservations = [];
                observationsDSUs.forEach(observationDSU=>{
                    patientObservations = patientObservations.concat(...observationDSU.observations);
                })

                console.log("*************** View IoT Data ***************")
                console.log(patientObservations);


                let selectedObservation = this.model.selectObservation.value;
                let desiredHealthData = patientObservations;
                if(selectedObservation){
                    desiredHealthData = desiredHealthData.filter(observation=>{
                        return observation.code.text === selectedObservation
                    })
                }

                console.log(desiredHealthData);
                this.navigateToPageTag('iot-helath-data', desiredHealthData);

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
                        label: "All data types",
                        value: ""
                    },
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
