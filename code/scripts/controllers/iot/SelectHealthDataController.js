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


                let selectedObservation = this.model.selectObservation.value !== "" ? this.model.selectObservation.value : "All data types";
                let state;
                let desiredHealthData;
                if(selectedObservation){
                    if(selectedObservation !== "All data types") {
                        desiredHealthData = patientObservations.filter(observation=>{
                            return observation.code.text === selectedObservation
                        })
                    } else desiredHealthData = patientObservations;


                    state = {
                        healthDataTitle: selectedObservation,
                        healthData: desiredHealthData
                    }

                }

                this.navigateToPageTag('iot-helath-data', state);

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
                        label: "Body temperature",
                        value: 'Body temperature'
                    },
                    {
                        label: "Heart rate",
                        value: 'Heart rate'
                    },
                    {
                        label: "Calories burned",
                        value: 'Calories burned'
                    },
                    {
                        label: "Steps",
                        value: 'Steps'
                    },
                    {
                        label: "Activity Duration",
                        value: 'Duration'
                    },
                    {
                        label: "Activity Distance",
                        value: 'Distance'
                    }
                ],
                value: ""
            }
            
        }
    }

}
