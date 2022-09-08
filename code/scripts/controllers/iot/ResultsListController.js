const commonServices = require('common-services');
const EvidenceService = commonServices.EvidenceService;
const {WebcController} = WebCardinal.controllers;

export default class ResultsListController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();
        this.prevState = this.getState() || {};
        this.model.studyID = this.prevState.studyID;
        this._attachHandlerBack();
    }

    async initServices() {
        this.EvidenceService= new EvidenceService();

        const getEvidences = () => {
            return new Promise ((resolve, reject) => {
                this.EvidenceService.getEvidences((err, evidences) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(evidences)
                })
            })
        }

        getEvidences().then(data => {
            this.model.results = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasResults = this.model.results.length !== 0;
            this.onTagClick("view-result", (model) => {
                let resultState = {
                    studyID: model.studyID,
                    resultID: model.uid,
                    participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
                }
                this.navigateToPageTag('view-result' ,resultState);
            });
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('completed-studies', {
                participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
            });
        });
    }
}
