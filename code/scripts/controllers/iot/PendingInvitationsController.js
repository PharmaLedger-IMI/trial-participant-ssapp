const {WebcController} = WebCardinal.controllers;

export default class PendingInvitationsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.studies = [
            {
                value: 'Medication from Oviedo Hospital'
            },
            {
                value: 'Vital signals at La Paz Hospital'
            },
            {
                value: 'All records with Monte Sinai'
            }
        ];

        this.onTagClick('view-study-details', (model) => {
            let invitationState = {
                pageType: 'pending-invitations',
                title: model,
                confirmationMessage: `Hello User ID! Hospital Saint Mary from London is about to start a Clinical trial on measuring Vit D after lockdown due to COVID-19.  Are you willing to participate?
                Hello User ID! Hospital Saint Mary from London is about to start a Clinical trial on measuring Vit D after lockdown due to COVID-19.`
            }
            this.navigateToPageTag('view-study-details', invitationState)
        })
    }
}
