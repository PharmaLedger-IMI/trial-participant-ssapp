const commonServices = require("common-services");
const {DPService, StudiesService} = commonServices;
const { WebcController } = WebCardinal.controllers;
const DataSourceFactory = commonServices.getDataSourceFactory();


export default class CompletedStudiesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.btnHandlers();
        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();

        this.model.participatingStudiesUIDs = [];
        this.model.participatingCompletedFullStudies = [];
        this.model.has_participatingCompletedStudies = false;

        const getParticipatingStudies = () => {
            return new Promise ((resolve, reject) => {
                this.dpService.getDPs((err, dPermission) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(dPermission)
                })
            })
        };

        getParticipatingStudies().then(data => {
            let DP = data && data.length > 0 ? data[0] : undefined
            if (DP){
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true) {
                            this.model.participatingStudiesUIDs.push(match.studyUID);
                        };
                    })
                    console.log("Found %d participating studies.", this.model.participatingStudiesUIDs.length);

                    const getCompletedStudies = () => {
                        return new Promise ((resolve, reject) => {
                            this.studiesService.getStudies((err, allStudies) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(allStudies)
                            })
                        })
                    };

                    getCompletedStudies().then(studies => {
                        this.model.participatingStudiesUIDs.forEach( studyUID => {
                            studies.forEach(mountedStudy => {
                                if (mountedStudy.uid===studyUID && mountedStudy.status==="completed"){
                                    this.model.participatingCompletedFullStudies.push(mountedStudy);
                                }
                            })
                        });
                        this.model.has_participatingCompletedStudies = this.model.participatingCompletedFullStudies.length !== 0;
                        this.model.participatingCompletedFullStudiesDataSource = DataSourceFactory.createDataSource(8, 3, this.model.participatingCompletedFullStudies);
                        this.onTagClick("view:evidence", (model) => {
                            this.navigateToPageTag('evidences-list')
                        });
                        this.onTagClick("view:feedback", (model) => {
                            this.navigateToPageTag('iot-feedback');
                        });
                        this.onTagClick("view:study", (model) => {
                            let studyState = {
                                pageType: 'completed-studies',
                                study: model
                            }
                            this.navigateToPageTag('view-study-details', studyState)
                        });
                    });
                }
            }
        });
    }

    btnHandlers() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });
    }
}
