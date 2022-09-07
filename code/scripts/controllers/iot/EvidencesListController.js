import EvidenceService from "../../services/EvidenceService.js";
const {WebcController} = WebCardinal.controllers;

export default class EvidencesListController extends WebcController {
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
            this.model.evidences = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasEvidences = this.model.evidences.length !== 0;
            this.onTagClick("view-evidence", (model) => {
                let evidenceState = {
                    studyID: model.studyID,
                    evidenceID: model.uid,
                    participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
                }
                this.navigateToPageTag('view-evidence' ,evidenceState);
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
