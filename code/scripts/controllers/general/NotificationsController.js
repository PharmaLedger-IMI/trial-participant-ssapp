const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const { WebcController } = WebCardinal.controllers;
import {getNotificationService} from "../../services/NotificationService.js";
const momentService = commonServices.momentService;
const Constants = commonServices.Constants;

export default class NotificationsController extends WebcController {
  constructor(...props) {
    super(...props);
    this._initServices().then(async () => {
      await this.getNotifications();
    });
    this._attachHandlerBack()
    // this.markNotificationHandler();
  }

  async _initServices() {
    this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);
    this.notificationService = getNotificationService();
  }

  async getNotifications() {
    let notifications = await this.notificationService.getNotifications();
    notifications.map(notification => {
      notification.date = momentService(notification.date).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
    });
    this.model.setChainValue('notifications', notifications);
    this.model.notificationsEmpty = (notifications.length == 0);
    this.viewNotificationHandler();
  }

  viewNotificationHandler() {
    this.onTagClick('view-notification', async (model) => {
      await this.markNotificationHandler(model);
      const {tagPage} = model;
      if (tagPage) {
        this.navigateToPageTag(tagPage);
      }
    });
  }

  async markNotificationHandler(model) {
      window.WebCardinal.loader.hidden = false;
      await this.notificationService.changeNotificationStatus(model.pk);
      await this.getNotifications();
      window.WebCardinal.loader.hidden = true;
  }

  _attachHandlerBack() {
    this.onTagClick('navigation:go-back', () => {
      this.navigateToPageTag("home");
    });
  }
}
