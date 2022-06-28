const commonServices = require('common-services');
const Constants = commonServices.Constants;
import {getNotificationService} from '../../NotificationService.js';
const notificationService = getNotificationService();

async function saveNotification(message, notificationInfo) {

    let notification = {
        ...message,
        uid: message.ssi ? message.ssi : message.uid,
        viewed: false,
        read: false,
        date: Date.now(),
        type: notificationInfo.notificationTitle,
        tagPage: notificationInfo.tagPage,
        state: notificationInfo.state
    }

    return await notificationService.insertNotification(notification);
}

export { saveNotification }
