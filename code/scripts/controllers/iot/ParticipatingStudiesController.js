const { WebcController } = WebCardinal.controllers;


export default class ParticipatingStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();
        this.model.has_participating_studies = this.model.participatingFullStudies.length !== 0;

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'participating-study',
                study: model,
                participatingFullStudies: this.model.toObject('participatingFullStudies')
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
