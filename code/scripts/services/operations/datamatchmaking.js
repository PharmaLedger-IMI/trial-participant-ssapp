const commonServices = require('common-services');
const {DPService} = commonServices;
const dpService = DPService.getDPService();

export function datamatchmaking(data) {

        dpService.getDPs((err, DPs) => {
            if (err) {
                return console.log(err);
            }
            let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
            if (DP) {
                let match = {
                    study: data.study,
                    patient: data.patient
                }
                if (!DP.matches) DP.matches = []
                DP.matches.push(match)
                dpService.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                })
            }
        });
}