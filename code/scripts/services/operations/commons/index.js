const commonServices = require('common-services');
import {getNotificationService} from '../../NotificationService.js';
const notificationService = getNotificationService();

async function saveNotification(message, type) {

    let notification = {
        ...message,
        uid: message.ssi ? message.ssi : message.uid,
        viewed: false,
        read: false,
        date: Date.now(),
        type: type
    }

    return await notificationService.insertNotification(notification);
}

export { saveNotification }
