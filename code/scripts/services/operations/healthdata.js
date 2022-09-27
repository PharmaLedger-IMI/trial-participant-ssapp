import { saveNotification } from './commons/index.js';
const commonServices = require('common-services');
const Constants = commonServices.Constants;
const HealthDataService = commonServices.HealthDataService;
const healthDataService = new HealthDataService();

export async function new_healthdata(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_HEALTHDATA);
    //health data update in existing dsu;
    if(typeof data.sReadSSI === "undefined"){
        console.log("Health data was updated");
        return;
    }
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

export async function device_assignation(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.DEVICE_ASSIGNED);
}

export async function device_deassignation(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.DEVICE_UNASSIGNED);
}