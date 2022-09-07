// const commonServices = require("common-services");
import EvidenceService from "../../services/EvidenceService.js";

const {WebcController} = WebCardinal.controllers;


export default class ViewEvidenceController extends WebcController {
    constructor(...props) {
        super(...props);

        this.prevState = this.getState() || {};
        this.EvidenceService = new EvidenceService();
        this.EvidenceService.getEvidence(this.prevState.evidenceID, (err, evidence) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getEvidenceDetailsViewModel(evidence);
        });

        this._attachHandlerBackMenu();
    }

    _attachHandlerBackMenu() {
        this.onTagClick('navigation:go-back', (event) => {
            this.navigateToPageTag('evidences-list', {
                studyID: this.prevState.studyID,
                participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
            });
        });
    }

    getEvidenceDetailsViewModel(evidence) {
        return {
            title: evidence.title,
            subtitle: evidence.subtitle,
            version: evidence.version,
            status: evidence.status,
            topics:  evidence.topics,
            exposureBackground: evidence.exposureBackground,
            description: evidence.description,
        }
    }
}
