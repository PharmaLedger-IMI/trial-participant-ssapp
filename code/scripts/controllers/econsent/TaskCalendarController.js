// import TaskService from "../../services/TaskService.js";

const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const DateTimeService = commonServices.DateTimeService;
const Constants = commonServices.Constants;
const momentService  = commonServices.momentService;
const BaseRepository = commonServices.BaseRepository;
const {QuestionnaireService} = commonServices;
import {getTPService}  from "../../services/TPService.js"


let getInitModel = () => {
    return {
        visits: []
    };
};

export default class TaskCalendarController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel({
            ...getInitModel(),
            visits: [],
            selectedVisit: {
                active: false,
                details: 'General details and description of the trial in case it provided by the Sponsor/Site regarding specific particularities of the Trial or general message for Trial Subject',
                toRemember: 'General details and description of the trial in case it provided by the Sponsor/Site regarding specific particularities of the Trial or general message for Trial Subject',
                procedures: 'General details and description of the trial in case it provided by the Sponsor/Site regarding specific particularities of the Trial or general message for Trial Subject',
            }
        });
        // TODO: Change mock data from details, toRemember and procedures.
        this._initServices();
        this._initHandlers();
        this._initVisits();

        this._attachHandlerShowTasks();
        // this.QuestionnaireService = new QuestionnaireService();
        // this.QuestionnaireService.getAllQuestionnaires((err, data) => {
        //     if (err) {
        //         return reject(err);
        //     }
        //     console.log(data[0]);
        // })

        //this.taskService = TaskService.getTaskService();

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
        this._attachHandlerAcceptVisit();
        this._attachHandlerDecline();
        this._attachHandlerConfirm();
        this._attachHandlerViewProcedures();
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
                    visitDate: momentService(visit.proposedDate).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern),
                    proposedDate: visit.proposedDate,
                    toShowDate: DateTimeService.convertStringToLocaleDate(visit.date)
                }
            });

        function filterVisits(visit) {
            if(visit.declined ===true || visit.accepted === true || visit.rescheduled === true) {
                return;
            }
            return visit;
        }

        this.model.visits = this.model.toObject('allVisits').filter(filterVisits);

        if (this.model.visits && this.model.visits.length > 0) {
            this.TPService.getTp((err, tp) => {
                if (err) {
                    return console.log(err);
                }
                this.model.tp = tp;
            })
        }
    }

    _updateTrialParticipant() {
        this.model.tp.visits = this.model.visits;
        this.TPService.updateTp(this.model.tp,(err)=>{
            if(err){
                console.log(err);
            }
        })
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

    _attachHandlerViewProcedures() {
        this.onTagEvent('procedures:view', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.navigateToPageTag('procedures-view', {
                procedures: model.visits.filter(visit => visit.id === model.selectedVisit.model.id),
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
                        this._updateVisit(model);
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
                        this._updateVisit(model);
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
                        this._updateVisit(model);
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
                }
            );
        });
    }

    _attachHandlerAcceptVisit() {
        this.onTagEvent('go-to-visit', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.model.selectedVisit.active = true;
            this.model.selectedVisit.model = model;
        });
    }

    _updateVisit(visit) {
        let objIndex = this.model.visits.findIndex((obj => obj.pk == visit.pk));
        this.model.visits[objIndex] = visit;
        this.VisitsAndProceduresRepository.updateAsync(visit.pk, visit);
    }

    sendMessageToHCO(visit, message) {
        this.CommunicationService.sendMessage(this.model.tp.hcoIdentity, {
            operation: Constants.MESSAGES.HCO.COMMUNICATION.TYPE.VISIT_RESPONSE,
            ssi: visit.trialSSI,
            useCaseSpecifics: {
                tpDid: this.model.tp.did,
                trialSSI: visit.trialSSI,
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