const commonServices = require('common-services');
const EvidenceService = commonServices.EvidenceService;
const {WebcController} = WebCardinal.controllers;


export default class ViewResultController extends WebcController {
    constructor(...props) {
        super(...props);

        this.prevState = this.getState() || {};
        this.EvidenceService = new EvidenceService();
        this.EvidenceService.getEvidence(this.prevState.resultID, (err, results) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getResultDetailsViewModel(results);
        });

        this._attachHandlerBackMenu();
    }

    _attachHandlerBackMenu() {
        this.onTagClick('navigation:go-back', (event) => {
            this.navigateToPageTag('results-list', {
                studyID: this.prevState.studyID,
                participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
            });
        });
    }

    getResultDetailsViewModel(results) {
        return {
            title: results.title,
            subtitle: results.subtitle,
            version: results.version,
            status: results.status,
            topics:  results.topics,
            exposureBackground: results.exposureBackground,
            description: results.description,
        }
    }
}
