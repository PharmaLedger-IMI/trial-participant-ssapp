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
            this.CommunicationService = getCommunicationServiceInstance();
            this.dpservice = DPService.getDPService();
            this.dpservice.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if((DP.matches) && (DP.matches.length>0)) {
                    let studyIndex = DP.matches.findIndex(match => match.study.uid === this.model.study.uid);
                    DP.matches[studyIndex].dpermission = true;
                    DP.matches[studyIndex].dpermissionDate = new Date();
                    DP.matches[studyIndex].study.acceptedDate = new Date();
                }
                this.dpservice.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                    console.log("DPermission added!");
                    this.CommunicationService.sendMessageToIotAdapter({
                        operation: "dp_updated",
                        studyUID: this.model.study.uid,
                        dpUID: data.uid
                    })
                })
            });
            this.navigateToPageTag('home')
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });

        this.onTagClick('reject', (model) => {
            console.log("create the dynamic permission in the same object of DP")
            this.navigateToPageTag('pending-invitations');
        });
    }
}
