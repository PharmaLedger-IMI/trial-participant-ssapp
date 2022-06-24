const commonServices = require('common-services');
const HealthDataService = commonServices.HealthDataService;
const healthDataService = new HealthDataService();

export function new_healthdata(data) {
    healthDataService.mountObservation(data.sReadSSI, (err, healthData) => {
        if (err) {
            console.log(err);
        }
        console.log("****************** Health Data ******************************")
        console.log(healthData);
        if(healthData){
            console.log("We have succe retrived data");
        }
        else {
            console.log("Your data is not available");
        }
    });
}