const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const { WebcController } = WebCardinal.controllers;
import {getNotificationService} from "../../services/NotificationService.js";
const DateTimeService = commonServices.DateTimeService;

export default class NotificationsController extends WebcController {
  constructor(...props) {
    super(...props);
    this._initServices().then(async () => {
      await this.getNotifications();
    });
    this.attachHandlers();
  }

  async _initServices() {
    this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);
    this.notificationService = getNotificationService();
  }

  async getNotifications() {
    let notifications = await this.notificationService.getNotifications();
    notifications.forEach(notification => {
      notification.toShowDate = DateTimeService.timeAgo(notification.date, true)
    });
    notifications.sort((a, b) => b.date - a.date);
    this.model.setChainValue('notifications', notifications);
    this.model.notificationsEmpty = (notifications.length === 0);
  }

  attachHandlers() {
    this.onTagClick('view-notification', async (model) => {
      await this.markNotificationHandler(model);
      //TODO disabled navigation for the moment according with https://github.com/PharmaLedger-IMI/eco-iot-pmed-workspace/issues/514
      //const {tagPage} = model;
      // if (tagPage) {
      //   this.navigateToPageTag(tagPage);
      // }
    });


    this.onTagClick('remove-notification', async (notification) => {
      window.WebCardinal.loader.hidden = false;
      await this.notificationService.removeNotification(notification);
      await this.getNotifications();
      window.WebCardinal.loader.hidden = true;
    });

    this.onTagClick('navigation:go-back', () => {
      this.navigateToPageTag("home");
    });
  }

  async markNotificationHandler(model) {
      window.WebCardinal.loader.hidden = false;
      await this.notificationService.changeNotificationStatus(model.pk);
      await this.getNotifications();
      window.WebCardinal.loader.hidden = true;
  }

}
