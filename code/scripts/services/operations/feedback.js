import FeedbackService from "../FeedbackService.js";
import { saveNotification } from './commons/index.js';
const commonServices = require('common-services');
const Constants = commonServices.Constants;
const feedbackService = new FeedbackService();

export async function new_feedback(data) {
    await saveNotification(data, Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_FEEDBACK);
    feedbackService.mount(data.ssi, (err, data) => {
        if (err) {
            return console.error(err);
        }
        feedbackService.getFeedbacks((err, feedbacks) => {
            if (err) {
                return console.error(err);
            }
            console.log('feedbacks',feedbacks)
        })
    });
}