const commonServices = require("common-services");
const {DPService, StudiesService} = commonServices;
const {WebcController} = WebCardinal.controllers;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const Constants = commonServices.Constants;


export default class ViewPermissionController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();

        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this.model.has_permissions = this.model.permissions.length > 0;

        this._attachHandlers();
    }


    _attachHandlers() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });

        this.onTagClick('revoke', (model) => {
            window.WebCardinal.loader.hidden = false;

            this.CommunicationService = getCommunicationServiceInstance();
            this.dpservice = DPService.getDPService();
            this.dpservice.getDPs((err, DPs) => {
                if (err) {
                    return console.log(err);
                }
                let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
                if((DP.matches) && (DP.matches.length>0)) {
                    let studyIndex = DP.matches.findIndex(match => match.studyUID === model.studyID);
                    DP.matches[studyIndex].dpermission = false;
                    DP.matches[studyIndex].dpermissionStopSharingDate = new Date();
                }
                this.dpservice.updateDP(DP, (err, data) => {
                    if (err){
                        console.log(err);
                    }
                    console.log(data);
                    this.CommunicationService.sendMessageToIotAdapter({
                        operation: Constants.MESSAGES.RESEARCHER.REMOVE_DYNAMIC_PERMISSION,
                        studyUID: model.studyID,
                        dpUID: data.uid
                    })
                })
            });
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('iot-health-studies');
        });


    }


}
