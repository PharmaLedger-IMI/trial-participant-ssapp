const commonServices = require('common-services');
const FeedbackService = commonServices.FeedbackService;
const {WebcController} = WebCardinal.controllers;


export default class ViewFeedbackController extends WebcController {
    constructor(...props) {
        super(...props);

        this.prevState = this.getState() || {};
        this.model.feedback_uid = this.prevState.feedbackID;
        this.model.studyID = this.prevState.studyID;

        this.FeedbackService= new FeedbackService();
        this.FeedbackService.getFeedback(this.model.feedback_uid, (err, feedback) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getFeedbackDetailsViewModel(feedback);
        });

        this._attachHandlerGoBack();
    }

    _attachHandlerGoBack() {
        this.onTagClick('navigation:go-back', () => {
            if(this.prevState.origin==="participatingStudies") {
                this.navigateToPageTag('iot-feedback', {
                    studyID: this.model.studyID,
                    participatingFullStudies: this.prevState.participatingFullStudies,
                    origin: this.prevState.origin
                });
            }
            else {
                this.navigateToPageTag('iot-feedback', {
                    studyID: this.model.studyID,
                    participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies,
                    origin: this.prevState.origin
                });
            }
        });
    }

    getFeedbackDetailsViewModel(feedback) {
        return {
            feedback_subject: feedback.feedback_subject,
            date: feedback.date,
            feedback_content:feedback.feedback_content,
        }
    }

}
