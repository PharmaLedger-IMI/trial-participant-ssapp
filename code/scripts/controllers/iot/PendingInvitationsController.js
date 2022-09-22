const {WebcController} = WebCardinal.controllers;


export default class PendingInvitationsController extends WebcController {
    constructor(...props) {
        super(...props);

        const state = this.getState();
        this.model.studyInvitations = JSON.parse(JSON.stringify(state.invitationsFullStudies));
        this.model.studyInvitations.forEach(study => {
            study.canJoin = study.status === "active";
        });

        this.model.hasInvitations = this.model.studyInvitations.length !== 0;

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'pending-invitations',
                study: model,
                invitationsFullStudies: state.invitationsFullStudies
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
