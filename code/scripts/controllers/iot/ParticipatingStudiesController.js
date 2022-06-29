const commonServices = require('common-services');
const {DPService, StudiesService} = commonServices;
const { WebcController } = WebCardinal.controllers;


export default class ParticipatingStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this.model.participatingStudiesUIDs = [];
        this.model.participatingFullStudies = [];
        this.model.has_participating_studies = false;
        this.model.startSharingDate = ""

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
                            this.model.participatingStudiesUIDs.push(match.studyUID);
                        };
                    })
                    console.log("Found %d participating studies.", this.model.participatingStudiesUIDs.length);
                    this.studiesService.getStudies((err, studies) => {
                        if (err){
                            return console.log(err);
                        }
                        this.model.participatingStudiesUIDs.forEach( studyUID => {
                            studies.forEach(mountedStudy => {
                                if (mountedStudy.uid===studyUID){
                                    this.model.participatingFullStudies.push(mountedStudy);
                                }
                            })
                        })
                    });
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
