const commonServices = require("common-services")
const { EvidenceService } = commonServices;
const evidenceService = new EvidenceService();

export function new_evidence(data) {
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