import { saveNotification } from './commons/index.js';
const commonServices = require('common-services');
const Constants = commonServices.Constants;
const {DPService, StudiesService} = commonServices;
const dpService = DPService.getDPService();
const studiesService = new StudiesService();


export async function datamatchmaking(data) {

    const mountStudy = () => {
        return new Promise ((resolve, reject) => {
            studiesService.mount(data.studysReadSSI,  async (err, mounted_study) => {
                if (err) {
                    return reject(err);
                }
                const notificationTitle = `${Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_INVITATION.notificationTitle} for ${mounted_study.title}`;
                let notificationInfo = {
                    ...Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_INVITATION,
                    notificationTitle: notificationTitle
                }
                await saveNotification(data, notificationInfo);

                resolve(mounted_study)
            })
        })
    }
    mountStudy().then(mounted_study => {

        dpService.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if (DP) {
                    let match = {
                        studyUID: mounted_study.uid,
                        patient: data.patientInformation
                    }
                    if (!DP.matches) DP.matches = []
                    DP.matches.push(match)
                    dpService.updateDP(DP, (err, data) => {
                        if (err){
                            console.log(err);
                        }
                        console.log("Invitation received with the following data:");
                        console.log(data.matches[data.matches.length-1]);
                    })
                }
            });
    })

}