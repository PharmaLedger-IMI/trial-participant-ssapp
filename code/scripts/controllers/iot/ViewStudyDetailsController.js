const commonServices = require('common-services');
const {DPService,StudiesService} = commonServices;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const {WebcController} = WebCardinal.controllers;
const Constants = commonServices.Constants;


export default class ViewStudyDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = this.getState() || {};
        const study = this.model.toObject('study');

        this.model.canJoinStudy = study.status === "active";

        this.onTagClick('confirm', (model) => {
            window.WebCardinal.loader.hidden = false;
            this.CommunicationService = getCommunicationServiceInstance();
            this.dpservice = DPService.getDPService();
            this.dpservice.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if((DP.matches) && (DP.matches.length>0)) {
                    let studyIndex = DP.matches.findIndex(match => match.studyUID === this.model.study.uid);
                    DP.matches[studyIndex].dpermission = true;
                    DP.matches[studyIndex].dpermissionStartSharingDate = new Date();
                }
                this.dpservice.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                    console.log("DPermission added!");
                    this.CommunicationService.sendMessageToIotAdapter({
                        operation: Constants.MESSAGES.RESEARCHER.ADD_DYNAMIC_PERMISSION,
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    })
                })
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies')
        });

        this.onTagClick('stop-sharing', (model) => {
            window.WebCardinal.loader.hidden = false;

            this.CommunicationService = getCommunicationServiceInstance();
            this.dpservice = DPService.getDPService();
            this.dpservice.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if((DP.matches) && (DP.matches.length>0)) {
                    let studyIndex = DP.matches.findIndex(match => match.studyUID === this.model.study.uid);
                    DP.matches[studyIndex].dpermission = false;
                    DP.matches[studyIndex].dpermissionStopSharingDate = new Date();
                }
                this.dpservice.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                    console.log("DPermission removed!");
                    this.CommunicationService.sendMessageToIotAdapter({
                        operation: Constants.MESSAGES.RESEARCHER.REMOVE_DYNAMIC_PERMISSION,
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    })
                })
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies');
        });

        this.onTagClick('navigation:go-back-participating-study', () => {
            this.navigateToPageTag('participating-studies', {participatingFullStudies: this.model.toObject('participatingFullStudies')});
        });

        this.onTagClick('navigation:go-back-pending-invitations', () => {
            this.navigateToPageTag('pending-invitations', {invitationsFullStudies: this.model.toObject('invitationsFullStudies')});
        });

        this.onTagClick('navigation:go-back-completed-study', () => {
            this.navigateToPageTag('completed-studies', {participatingCompletedFullStudies: this.model.toObject('participatingCompletedFullStudies')});
        });

        this.onTagClick('reject', (model) => {
            window.WebCardinal.loader.hidden = false;
            this.CommunicationService = getCommunicationServiceInstance();
            this.dpservice = DPService.getDPService();
            this.dpservice.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if((DP.matches) && (DP.matches.length>0)) {
                    let studyIndex = DP.matches.findIndex(match => match.studyUID === this.model.study.uid);
                    DP.matches[studyIndex].dpermission = false;
                    DP.matches[studyIndex].dpermissionRejectedDate = new Date();
                }
                this.dpservice.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                    console.log("DPermission rejected!");
                    this.CommunicationService.sendMessageToIotAdapter({
                        operation: Constants.MESSAGES.RESEARCHER.REJECT_DYNAMIC_PERMISSION,
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    });
                });
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies');
        });
        this.onTagClick('dismiss', (model) => {
            const studiesService = new StudiesService();
            studiesService.unMount(model.uid, () => {
                window.WebCardinal.loader.hidden = true;
                this.navigateToPageTag('iot-health-studies');
            })
        })
    }
}
