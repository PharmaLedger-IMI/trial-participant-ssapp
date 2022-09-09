const commonServices = require('common-services');
const FeedbackService = commonServices.FeedbackService;
import { saveNotification } from './commons/index.js';
const Constants = commonServices.Constants;
const feedbackService = new FeedbackService();

export async function new_feedback(data) {
    feedbackService.mount(data.ssi, async (err, data) => {
        if (err) {
            return console.error(err);
        }
        const notificationTitle = `${Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_FEEDBACK.notificationTitle} for ${data.studyTitle}`;
        let notificationInfo = {
            ...Constants.PATIENT_NOTIFICATIONS_TYPE.NEW_FEEDBACK,
            notificationTitle: notificationTitle
        }
        await saveNotification(data, notificationInfo);
        feedbackService.getFeedbacks((err, feedbacks) => {
            if (err) {
                return console.error(err);
            }
            console.log('feedbacks',feedbacks)
        })
    });
}