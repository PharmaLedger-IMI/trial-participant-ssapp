const { WebcController } = WebCardinal.controllers;

export default class CompletedStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();
        this.model.has_participatingCompletedStudies = this.model.participatingCompletedFullStudies.length !== 0;
        this.btnHandlers();
    }

    btnHandlers() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });
        this.onTagClick("view:results", (model) => {
            let state = {
                studyID: model.uid,
                participatingCompletedFullStudies: this.model.toObject('participatingCompletedFullStudies')
            }
            this.navigateToPageTag('results-list', state)
        });
        this.onTagClick("view:feedback", (model) => {
            let state = {
                studyID: model.uid,
                participatingCompletedFullStudies: this.model.toObject('participatingCompletedFullStudies')
            }
            this.navigateToPageTag('iot-feedback', state);
        });
        this.onTagClick("view:study", (model) => {
            let studyState = {
                pageType: 'completed-studies',
                study: model,
                participatingCompletedFullStudies: this.model.toObject('participatingCompletedFullStudies')
            }
            this.navigateToPageTag('view-study-details', studyState)
        });
    }
}
