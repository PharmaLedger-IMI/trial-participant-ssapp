import FeedbackService from "../../services/FeedbackService.js";
const {WebcController} = WebCardinal.controllers;

export default class ViewFeedbackController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};

        this.model.feedback_uid = prevState.feedbackID;
        this.model.feedback_id = prevState.studyID;
        this.model.studyTitle = prevState.studyTitle;
        this.model.header = "View Feedback";

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
            this.navigateToPageTag('iot-feedback');
        });
    }

    getFeedbackDetailsViewModel(feedback) {
        return {
            feedback_subject: {
                name: 'feedback_subject',
                id: 'feedback_subject',
                label: "Feedback subject:",
                placeholder: 'Subject',
                required: true,
                value: feedback.feedback_subject || ""
            },
            date: {
                name: 'date',
                id: 'date',
                label: "Date: ",

                required: true,
                value: feedback.date || ""
            },
            feedback_content: {
                name: 'feedback_content',
                id: 'feedback_content',
                label: "Description: ",

                value: feedback.feedback_content || ""
            },


            id: {
                name: 'id of the feedback',
                label: "ID:",

                value: feedback.uid || ""
            }
        }
    }

}
