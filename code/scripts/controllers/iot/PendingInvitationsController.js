const {WebcController} = WebCardinal.controllers;


export default class PendingInvitationsController extends WebcController {
    constructor(...props) {
        super(...props);

        const state = this.getState();
        const invitationsFullStudies = state.invitationsFullStudies;

        this.model.studyInvitations = invitationsFullStudies.filter(s => (s.status ==="approved" ||  s.status==="active"));
        this.model.hasInvitations = this.model.studyInvitations.length !== 0;

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'pending-invitations',
                study: model,
                invitationsFullStudies: this.model.toObject('studyInvitations')
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
