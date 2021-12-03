const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const DateTimeService  = commonServices.DateTimeService;
const { WebcController } = WebCardinal.controllers;

export default class NotificationsController extends WebcController {
  constructor(...props) {
    super(...props);
    this._initServices();
    this._attachNotificationNavigationHandler();
    this._initNotifications();
  }

  _initServices() {
    this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);
  }

  _initNotifications() {
    this.model.notifications = [];
    this.NotificationsRepository.findAll((err, data) => {
      if (err) {
        return console.log(err);
      }
      let notificationsMappedAndSorted = data
        .map((notification) => {
          return {
            ...notification,
            entitySSI: notification.ssi,
            name: notification.type,
            details: notification.shortDescription ? notification.shortDescription : "Tap on the notification to see further details",
            date:DateTimeService.timeAgo(notification.date, true)
          };
        })
        .sort(function (a, b) {
          if (!a.viewed && b.viewed) {
            return -1;
          }
          if (!b.viewed && a.viewed) {
            return 1;
          }
          return new Date(a.startDate).getMilliseconds() - new Date(b.startDate).getMilliseconds();
        });
      this.model.notifications.push(...notificationsMappedAndSorted);
    });
  }

  _attachNotificationNavigationHandler() {
    this.onTagEvent('go-to-notification', 'click', (model, target, event) => {
      let page = Constants.getPageByNotificationType(model.type);
      if (!model.viewed) {
        model.viewed = true;
        this.NotificationsService.updateNotification(model, (err, data) => {
          if (err) {
            return console.log(err);
          }
          this.navigateToPageTag(page, model.entitySSI);
        });
      } else {
        this.navigateToPageTag(page, model.entitySSI);
      }
    });
  }
}
