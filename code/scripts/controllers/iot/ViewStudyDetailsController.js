const commonServices = require('common-services');
const {DPService} = commonServices;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const {WebcController} = WebCardinal.controllers;


export default class ViewStudyDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState;

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
                        operation: "dp_updated_add",
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
                        operation: "dp_updated_remove",
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    })
                })
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies');
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });


        this.onTagClick('navigation:back-to-completed-studies', () => {
            this.navigateToPageTag('completed-studies');
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
                        operation: "dp_updated_reject",
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    });
                });
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies');
        });
    }
}
