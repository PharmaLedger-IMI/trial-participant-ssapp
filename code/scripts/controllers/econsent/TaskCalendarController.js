import {getTPService}  from "../../services/TPService.js";
import TaskService from "../../services/TaskService.js";
const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const DateTimeService = commonServices.DateTimeService;
const Constants = commonServices.Constants;
const momentService  = commonServices.momentService;
const BaseRepository = commonServices.BaseRepository;
const taskService = TaskService.getTaskService();

export default class TaskCalendarController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {
            visits: []
        };

        this._initServices();
        this._initHandlers();
        this._initVisits();

        this._attachHandlerShowTasks();

    }

    _attachHandlerShowTasks() {
        this.onTagClick('day', (model) => {
            if (model.disabled === true) {
                return;
            }
            let info = {
                month: model.month,
                day: model.value,
                year: model.year,
                today: model.type === "today",
                visits: this.model.toObject('allVisits')
            };
            this.navigateToPageTag('econsent-tasks', info);
        });
    }

    _initHandlers() {
        this._attachHandlerBack();
        this._attachHandlerDetails();
        this._attachHandlerDecline();
        this._attachHandlerConfirm();
        this._attachHandlerRescheduleInvitation();
    }

    _initServices() {
        this.VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS);
        this.TPService = getTPService();
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance()
    }

    async _initVisits() {

        this.model.allVisits = (await this.VisitsAndProceduresRepository.findAllAsync())
            .map(visit => {
                return {
                    ...visit,
                    visitDate: (new Date(visit.proposedDate)).toLocaleString(),
                    proposedDate: visit.proposedDate,
                    toShowDate: DateTimeService.convertStringToLocaleDate(visit.date)
                }
            });

        function filterVisits(visit) {
            if(visit.declined === true || visit.accepted === true || visit.rescheduled === true || visit.confirmed === true) {
                return;
            }
            return visit;
        }

        this.model.visits = this.model.toObject('allVisits').filter(filterVisits);
        this.model.invitationsNumber = this.model.visits.length;
        this.model.hasInvitations = this.model.visits.length>0;
        if (this.model.visits.length > 0) {
            this.TPService.getTp((err, tp) => {
                if (err) {
                    return console.log(err);
                }
                this.model.tp = tp;
            })
        }
    }

    _attachHandlerBack() {
        this.onTagClick('back', () => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerDetails() {
        this.onTagEvent('viewConsent', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.navigateToPageTag('econsent-sign', {
                trialSSI: model.trialSSI,
                econsentSSI: model.consentSSI,
                controlsShouldBeVisible: false
            });

        });
    }

    _attachHandlerDecline() {
        this.onTagEvent('visit:decline', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showModalFromTemplate(
                'general/confirmation-alert',
                async (event) => {
                    const response = event.detail;
                    if (response) {
                        model.accepted = false;
                        model.declined = true;
                        await this._updateVisit(model);
                        this.sendMessageToHCO(model, Constants.MESSAGES.HCO.COMMUNICATION.PATIENT.VISIT_DECLINED);

                        await this._initVisits();
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'general/ConfirmationAlertController',
                    disableExpanding: false,
                    disableBackdropClosing: false,
                    question: 'Are you sure you want to decline this visit? ',
                    title: 'Decline visit',
                });
        });
    }

    _attachHandlerConfirm() {
        this.onTagEvent('visit:confirm', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showModalFromTemplate(
                'general/confirmation-alert',
                async (event) => {
                    const response = event.detail;
                    if (response) {
                        model.accepted = true;
                        model.declined = false;
                        if(model.confirmedDate) {
                            delete model.confirmedDate;
                        }
                        await this._updateVisit(model);
                        this.sendMessageToHCO(model, Constants.MESSAGES.HCO.COMMUNICATION.PATIENT.VISIT_ACCEPTED);

                        await this._initVisits();
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'general/ConfirmationAlertController',
                    disableExpanding: false,
                    disableBackdropClosing: false,
                    question: 'Are you sure you want to confirm this visit? ',
                    title: 'Accept visit',
                });
        });
    }

    _attachHandlerRescheduleInvitation() {
        this.onTagEvent('reschedule-invitation', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showModalFromTemplate(
                'econsent/reschedule-invitation',
                async (event) => {
                    const response = event.detail.desiredDate;
                    if(response) {
                        let date = new Date(response);
                        model.rescheduled = true;
                        model.proposedDate = date.getTime();
                        if(model.confirmedDate) {
                            delete model.confirmedDate;
                        }
                        await this._updateVisit(model);
                        this.sendMessageToHCO(model, Constants.MESSAGES.HCO.COMMUNICATION.PATIENT.VISIT_RESCHEDULED);
                        await this._initVisits();
                    }

                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'modals/RescheduleInvitationController',
                    disableExpanding: false,
                    disableBackdropClosing: true,
                    question: 'Are you sure you want to reschedule this visit?',
                    title: 'Reschedule visit',
                    suggestedInterval: model.suggestedInterval,
                    isExtended: model.isExtended
                }
            );
        });
    }

    async _updateVisit(visit) {
        if(visit.declined === true) {
            taskService.getTasks((err,tasks) => {
                if(err) {
                    return console.error(err);
                }
                let index = tasks.item.findIndex(t => t.uid === visit.uid);
                if(index === -1) {
                    return;
                }
                tasks.item.splice(index, 1);
                taskService.updateTasks(tasks,(err) => {
                    if(err) {
                        console.error(err);
                    }
                })
            })
        }
        let objIndex = this.model.visits.findIndex((obj => obj.pk === visit.pk));
        this.model.visits[objIndex] = visit;
        await this.VisitsAndProceduresRepository.updateAsync(visit.pk, visit);
    }

    sendMessageToHCO(visit, message) {
        this.CommunicationService.sendMessage(this.model.tp.hcoIdentity, {
            operation: Constants.MESSAGES.HCO.COMMUNICATION.TYPE.VISIT_RESPONSE,
            useCaseSpecifics: {
                tpDid: this.model.tp.did,
                visit: {
                    details: visit.details,
                    toRemember: visit.toRemember,
                    procedures: visit.procedures,
                    name: visit.name,
                    period: visit.period,
                    consentSSI: visit.consentSSI,
                    date: visit.date,
                    unit: visit.unit,
                    accepted: visit.accepted,
                    declined: visit.declined,
                    rescheduled: visit.rescheduled,
                    proposedDate: visit.proposedDate,
                    confirmedDate: visit.confirmedDate,
                    confirmed: visit.confirmed,
                    id: visit.uid
                },
            },
            shortDescription: message,
        });
    }

}