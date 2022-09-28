import {uuidv4} from "../utils/utils.js";

const commonServices = require('common-services');
const DSUService = commonServices.DSUService;
const SharedStorage = commonServices.SharedStorage;
const {getSharedStorage} = SharedStorage;


class NotificationService  extends DSUService {
    NOTIFICATIONS_TABLE = 'notifications';

    constructor() {
        super();
        this.storageService = getSharedStorage(this.DSUStorage);
        this.subscribers = [];
        this.notifications = null;
    }

    async getNumberOfUnreadNotifications() {
        const notifications = await this.getNotifications();
        return notifications.filter((x) => !x.read).length;
    }

    async getNotifications() {
        if(this.notifications === null) {
            this.notifications = await this.storageService.filter(this.NOTIFICATIONS_TABLE);
        }
        return this.notifications;
    }

    async removeNotification(removedNotification){
        const notificationIndex = this.notifications.findIndex(notification=>{
            return notification.pk === removedNotification.pk;
        });
        if (notificationIndex === -1) {
            console.log("Notification marked for deletion not found.")
        } else {
            await this.storageService.deleteRecordAsync(this.NOTIFICATIONS_TABLE, removedNotification.pk);
            this.notifications.splice(notificationIndex, 1);
        }
        return this.notifications;
    }

    async insertNotification(notification) {
        const id = uuidv4();
        const newRecord = await this.storageService.insertRecordAsync(this.NOTIFICATIONS_TABLE, id, notification);
        this.notifications.push(newRecord);
        for(let subscriber of this.subscribers) {
            subscriber();
        }
        return newRecord;
    }

    async changeNotificationStatus(id) {
        const notification = this.notifications.find(notification => notification.pk === id);
        notification.read = !notification.read;

        await this.storageService.updateRecord(this.NOTIFICATIONS_TABLE, id, notification);
    }

    onNotification(callback) {
        if(typeof callback !== 'function') {
            throw new Error(`callback is not a function`);
        }
        this.subscribers.push(callback);
    }

    offNotification(callback) {
        let index = this.subscribers.indexOf(callback);
        if(index !== -1 ) {
            return this.subscribers.splice(index, 1);
        }
        console.log(`Subscriber doesn't exist`);
    }
};

let instance = null;

export const getNotificationService = ()=>{
    if (!instance) {
        instance = new NotificationService()
    }
    return instance
}

export default { getNotificationService }

