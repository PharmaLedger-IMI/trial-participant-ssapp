import FeedbackService from "../FeedbackService.js";
const feedbackService = new FeedbackService();

export function new_feedback(data) {
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