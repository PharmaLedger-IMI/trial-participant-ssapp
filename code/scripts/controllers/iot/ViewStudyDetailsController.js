const {WebcController} = WebCardinal.controllers;

export default class ViewStudyDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState;

        this.onTagClick('confirm', (model) => {
            let objToSend = {
                confirmationMessage: `Hello User ID! Thanks for accepting the request. 
                Are you willing to give permission to hospitals/pharmas/stakeholders to re-use your data? 
                Are you willing to give permission to hospitals/pharmas/stakeholders to re-use your data?
                Are you willing to give permission to hospitals/pharmas/stakeholders to re-use your data?`
            }
            this.navigateToPageTag('user-permission', objToSend)
            console.log(objToSend)
        })
    }
}
