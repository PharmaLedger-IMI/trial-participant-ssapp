const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;

async function saveNotification(message, type) {
    const NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);

    let notification = {
        ...message,
        uid: message.ssi,
        viewed: false,
        date: Date.now(),
        type: type
    }

    return await NotificationsRepository.createAsync(notification.uid, notification);
}

export { saveNotification }