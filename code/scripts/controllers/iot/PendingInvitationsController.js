const commonServices = require('common-services');
const {DPService, StudiesService} = commonServices;
const {WebcController} = WebCardinal.controllers;


export default class PendingInvitationsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this.model.invitationsStudiesUIDs = [];
        this.model.invitationsFullStudies = [];
        this.model.has_invitations = false;

        this.dpService.getDPs((err, DPs) => {
            if (err) {
                return console.log(err);
            }
            let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
            if (DP) {
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true) return;
                        this.model.invitationsStudiesUIDs.push(match.studyUID)
                    })
                    if (this.model.invitationsStudiesUIDs.length>0) {
                        this.model.has_invitations = true;
                        console.log("Found %d invitations.", this.model.invitationsStudiesUIDs.length);
                    }

                    this.studiesService.getStudies((err, studies) => {
                        if (err){
                            return console.log(err);
                        }
                        this.model.invitationsStudiesUIDs.forEach( studyUID => {
                           studies.forEach(mountedStudy => {
                               if (mountedStudy.uid===studyUID){
                                   this.model.invitationsFullStudies.push(mountedStudy);
                               }
                           })
                        })
                    });
                }
            }
        });

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'pending-invitations',
                study: model
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
