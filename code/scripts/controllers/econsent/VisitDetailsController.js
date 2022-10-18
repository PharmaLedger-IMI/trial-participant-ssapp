import {getTPService} from "../../services/TPService.js";

const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const Constants = commonServices.Constants;
const momentService = commonServices.momentService;
const BaseRepository = commonServices.BaseRepository;
const CommunicationService = commonServices.CommunicationService;

export default class VisitDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        this.state = {
            ...this.getState()
        };

        this.model.details = this.state.details;
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();

        this.state.visits.forEach(visit=>{
            if(visit.accepted === true || visit.confirmed === true) {
                return visit.status = 'accepted';
            }
            if(visit.rescheduled === true) {
                return visit.status = 'rescheduled';
            }
            return visit.status = 'pending';
        });

        this.state.visits = this.state.visits.filter((visit) => {
            return visit.uuid !== this.state.uuid && !visit.declined
        })

        this.model.visits = this.state.visits.sort((a, b) => a.proposedDate - b.proposedDate);
        this.model.hasOtherVisitsScheduled =  this.model.visits.length > 0;

        if(this.state.schedule.startDate) {
            this.model.toShowDate = momentService(this.state.schedule.startDate).format(Constants.DATE_UTILS.FORMATS.DateTimeFormatPattern);
        }
        this.getTp();
        this._initHandlers();
    }

    _initHandlers() {
        this._attachHandlerBack();
        this._attachHandlerProcedures();
        this._attachHandlerRescheduleVisit();
    }

    getTp() {
        this.TPService = getTPService();
        this.TPService.getTp((err, tp) => {
            if (err) {
                return console.log(err);
            }
            this.model.tp = tp;
        })
    }

    _attachHandlerRescheduleVisit() {
        this.onTagEvent('reschedule-visit', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS);

            VisitsAndProceduresRepository.findBy(this.state.uuid, (err, existingVisit) => {
                if (err || !existingVisit) {
                    return console.err(err);

                }
                this.showModalFromTemplate(
                    'econsent/reschedule-invitation',
                    async (event) => {
                        const response = event.detail.desiredDate;
                        if(response) {
                            let date = new Date(response);
                            existingVisit.rescheduled = true;
                            existingVisit.proposedDate = date.getTime();
                            if(existingVisit.confirmedDate) {
                                delete existingVisit.confirmedDate;
                                delete existingVisit.accepted;
                                delete existingVisit.confirmed;
                            }
                            await VisitsAndProceduresRepository.updateAsync(existingVisit.pk, existingVisit)
                            this.sendMessageToHCO(existingVisit, Constants.MESSAGES.HCO.COMMUNICATION.PATIENT.VISIT_RESCHEDULED);
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
                        suggestedInterval: existingVisit.suggestedInterval,
                        isExtended: existingVisit.isExtended
                    }
                );
            });
        });
    }

    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();
        });
    }

    _attachHandlerProcedures() {
        this.onTagClick('navigate:procedures', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            let details = this.model.toObject('details');
            let info = {
                procedures: details.procedures.filter(procedure => procedure.checked && procedure.status !== "N/A")
            }
            this.navigateToPageTag('procedures-view', info);
        });
    }

    sendMessageToHCO(visit, message) {
        this.CommunicationService.sendMessage(this.model.tp.hcoIdentity, {
            operation: Constants.MESSAGES.HCO.COMMUNICATION.TYPE.VISIT_RESPONSE,
            useCaseSpecifics: {
                tpDid: this.model.tp.did,
                visit: {
                    procedures: visit.procedures,
                    name: visit.name,
                    rescheduled: visit.rescheduled,
                    proposedDate: visit.proposedDate,
                    isExtended: visit.isExtended,
                    uuid: visit.uuid,
                },
            },
            shortDescription: message,
        });
    }

}
