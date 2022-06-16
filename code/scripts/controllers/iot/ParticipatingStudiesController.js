const commonServices = require('common-services');
const {DPService} = commonServices;
const { WebcController } = WebCardinal.controllers;


export default class ParticipatingStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.dpService = DPService.getDPService();
        this.model.participating_studies = [];
        this.model.has_participating_studies = false;

        const getParticipatingStudies = () => {
            return new Promise ((resolve, reject) => {
                this.dpService.getDPs((err, dPermission) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(dPermission)
                })
            })
        }

        getParticipatingStudies().then(data => {
            let DP = data && data.length > 0 ? data[0] : undefined
            if (DP){
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true) {
                            this.model.has_participating_studies = true;
                            this.model.participating_studies.push(match.study);
                        };
                    })
                    console.log("Found %d participating studies.", this.model.participating_studies.length);
                }
            }
        });

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'participating-study',
                study: model
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
