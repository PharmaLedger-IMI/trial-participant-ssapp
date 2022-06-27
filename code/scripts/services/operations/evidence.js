import { saveNotification } from './commons/index.js';
const commonServices = require("common-services")
const { EvidenceService } = commonServices;
const Constants = commonServices.Constants;
const evidenceService = new EvidenceService();

export async function new_evidence(data) {
    await saveNotification(data, Constants.NOTIFICATIONS_TYPE.NEW_EVIDENCE);
    evidenceService.mount(data.ssi, (err, data) => {
        if (err) {
            return console.error(err);
        }
        evidenceService.getEvidences((err, evidences) => {
            if (err) {
                return console.error(err);
            }
            console.log('evidences', evidences)
        });
    })
}