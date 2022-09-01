const {WebcController} = WebCardinal.controllers;


export default class PendingInvitationsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();
        this.model.has_invitations = this.model.invitationsFullStudies.length !== 0;

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'pending-invitations',
                study: model
            }
            this.navigateToPageTag('view-study-details', invitationState)
        });

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies')
        });
    }
}
