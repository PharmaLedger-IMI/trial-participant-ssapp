import FeedbackService from "../../services/FeedbackService.js";

const commonServices = require("common-services");
const DataSourceFactory = commonServices.getDataSourceFactory();


const {WebcController} = WebCardinal.controllers;

export default class FeedbackController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();
        const prevState = this.getState() || {};
        this.model.studyID = prevState.studyID;
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
            let feedback = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasFeedback = feedback.length !== 0;
            this.model.feedbackDataSource = DataSourceFactory.createDataSource(3, 5, feedback);
            const { feedbackDataSource } = this.model;

            this.onTagClick("view-feedback", (model) => {
                let state = {
                    studyID: this.model.studyID,
                    studyTitle: this.model.studyTitle,
                    feedbackID: model.uid,
                }
                this.navigateToPageTag('view-feedback', state);
            });
            this.onTagClick("prev-page", () => feedbackDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => feedbackDataSource.goToNextPage());
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('completed-studies');
        });
    }
}
