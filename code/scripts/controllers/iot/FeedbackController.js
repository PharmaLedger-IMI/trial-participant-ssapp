import FeedbackService from "../../services/FeedbackService.js";
const {WebcController} = WebCardinal.controllers;

export default class FeedbackController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();
        this.prevState = this.getState() || {};
        this.model.studyID = this.prevState.studyID;
        this._attachHandlerBack();
    }

    async initServices() {
        this.FeedbackService= new FeedbackService();

        const getFeedback = () => {
            return new Promise ((resolve, reject) => {
                this.FeedbackService.getFeedbacks((err, received_feedback) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_feedback)
                })
            })
        }

        getFeedback().then(data => {
            this.model.feedbacks = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasFeedbacks = this.model.feedbacks.length !== 0;

            this.onTagClick("view-feedback", (model) => {
                let state = {
                    studyID: this.model.studyID,
                    studyTitle: this.model.studyTitle,
                    feedbackID: model.uid,
                    participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies,
                    participatingFullStudies: this.prevState.participatingFullStudies,
                    origin: this.prevState.origin
                }
                this.navigateToPageTag('view-feedback', state);
            });
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            if(this.prevState.origin==="participatingStudies") {
                this.navigateToPageTag('participating-studies', {
                    participatingFullStudies: this.prevState.participatingFullStudies
                });
            }
            else {
                this.navigateToPageTag('completed-studies', {
                    participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
                });
            }
        });
    }
}
