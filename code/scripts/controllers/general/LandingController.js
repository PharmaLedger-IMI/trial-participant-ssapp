import TrialService from "../../services/TrialService.js";
import TrialConsentService from "../../services/TrialConsentService.js";
import ProfileService from '../../services/ProfileService.js';
import {getTPService} from "../../services/TPService.js";
import {getOperationsHookRegistry} from '../../services/operations/operationsHookRegistry.js';
import handlerOperations from "../../services/MessageHandlerStrategy.js";
import {getNotificationService} from "../../services/NotificationService.js";

const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const DidService = commonServices.DidService;
const MessageHandlerService = commonServices.MessageHandlerService;
const HealthDataService = commonServices.HealthDataService;
const usecases = WebCardinal.USECASES;

const CONSTANTS = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const {QuestionnaireService, DeviceAssignationService} = commonServices;

export default class LandingController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = JSON.parse(JSON.stringify(usecases));

        DidService.getDidServiceInstance().getDID().then(async (did) => {
            this.model.did = did;
            await this.initServices();
            this.addHandlers();
        });

        this.healthDataService = new HealthDataService();
        this.OperationsHookRegistry = getOperationsHookRegistry();
        this.notificationService = getNotificationService();
        this.notificationService.onNotification(this.getNumberOfNotifications.bind(this));
        this.getNumberOfNotifications();
    }

    getNumberOfNotifications() {
        this.notificationService.getNumberOfUnreadNotifications().then(numberOfNotifications => {
            {
                if(numberOfNotifications) {
                    this.model.notificationsNumber = numberOfNotifications;
                    this.model.hasNotifications = true;
                } else this.model.hasNotifications = false;
            }
        })
    }

    _initTrials() {
        this.model.trials = [];
        this.TrialService.getTrials((err, data) => {
            if (err) {
                return console.error(err);
            }
            this.model.trials = data;
            this.model.notAssigned = !this.model.trials.length;
            this._initTrialParticipant();
        });
    }

    _initTrialParticipant() {
        this.model.tp = {};
        this.TPService.getTp((err, tp) => {
            if (err) {
                return console.log("Participant not added to a trial yet");
            }
            this.model.tp = tp;
            MessageHandlerService.initCustomMessageHandler(this.model.tp.did, handlerOperations(this.OperationsHookRegistry));

        })
    }

    addHandlers() {
        this.onTagEvent("navigate:notifications", "click", () => {
            this.navigateToPageTag('notifications');
        });
        this.onTagEvent("navigate:my-profile", "click", () => {
            this.navigateToPageTag('my-profile');
        });
        this.onTagEvent("navigate:consent-status", "click", (trial, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (!this.model.notAssigned) {
                this.navigateToPageTag('trial');
            }
        });
        this.onTagEvent("navigate:task-calendar", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag('task-calendar');
            }
        });
        this.onTagEvent("navigate:iot-devices", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag("iot-data-selection");
            }
        });
        this.onTagEvent("navigate:health-studies", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag('iot-health-studies');
            }
        });
    }

    async initServices() {
        this._attachMessageHandlers();
        this.QuestionnaireService = new QuestionnaireService();
        this.DeviceAssignationService = new DeviceAssignationService();
        this.TrialService = new TrialService();
        this.TPService = getTPService();
        this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);
        this.VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS);
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS);
        this.TrialConsentService = new TrialConsentService();
        this.model.trialConsent = await this.TrialConsentService.getOrCreateAsync();
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err, data) => {
            this.model.profilePicture = data
        })

        this._initTrials();
        this._initTrialParticipant();
    }

    _attachMessageHandlers() {
        this.OperationsHookRegistry.register(CONSTANTS.MESSAGES.HCO.SEND_HCO_DSU_TO_PATIENT, (err, data) => {
            if (err) {
                return console.error(err);
            }
            this.model.tp = data.trialData.tp;
            let hcoIdentity = data.trialData.tp.hcoIdentity;
            if (data.originalMessage.useCaseSpecifics.tp.publicDid) {
                let communicationService = CommunicationService.getExtraCommunicationService(data.originalMessage.useCaseSpecifics.tp.publicDid);
                communicationService.listenForMessages(async (err, message) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('message received for public did', message);
                })
            }
            this._mountHCODSUAndSaveConsentStatuses(data.originalMessage, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this._sendTrialConsentToHCO(hcoIdentity);
                this._initTrials();
            });
        });

        this.OperationsHookRegistry.register(CONSTANTS.MESSAGES.HCO.SEND_REFRESH_CONSENTS_TO_PATIENT, async (err, data) => {
            if(err) {
                return console.error(err);
            }
            this.model.trialConsent = data.trialConsent;
            this.getNumberOfNotifications();

            await this._saveConsentsStatuses(this.model.trialConsent.volatile?.ifc);
        });

        this.OperationsHookRegistry.register(CONSTANTS.MESSAGES.PATIENT.UPDATE_TP_NUMBER, (err, data) => {
            if(err) {
                return console.error(err);
            }
            this._updateTrialParticipant(data.useCaseSpecifics, (err) => {
                if (err) {
                    return console.log(err);
                }
            });
        });

        this.OperationsHookRegistry.register(CONSTANTS.MESSAGES.HCO.VISIT_SCHEDULED, async(err, data) => { //here
            if(err) {
                return console.error(err);
            }
            await this._saveVisit(data.useCaseSpecifics.visit);
        });

        MessageHandlerService.init(handlerOperations(this.OperationsHookRegistry));

    }

    _sendTrialConsentToHCO(hcoIdentity) {
        let sendObject = {
            operation: CONSTANTS.MESSAGES.PATIENT.SEND_TRIAL_CONSENT_DSU_TO_HCO,
            ssi: this.TrialConsentService.sReadSSI,
            shortDescription: null,
        };
        let communicationService = CommunicationService.getCommunicationServiceInstance();
        communicationService.sendMessage(hcoIdentity, sendObject);
    }

    _mountHCODSUAndSaveConsentStatuses(data, callback) {
        this.TrialConsentService.mountHCODSU(data.ssi, (err, trialConsent) => {
            if (err) {
                return callback(err);
            }
            this.model.trialConsent = trialConsent;
            callback(err, trialConsent);
        })
    }

    async _saveConsentsStatuses(consents) {
        if (consents === undefined) {
            consents = [];
        }

        //TODO extract this to a service. it is used also in TrialController
        let statusesMappedByConsent = {};
        let statuses = await this.EconsentsStatusRepository.findAllAsync();
        statuses.filter(status => status.tpDid === this.model.tpDid);

        statuses.forEach(status => {
            statusesMappedByConsent[status.foreignConsentId] = status;
        })

        for (const consent of consents) {
            let consentStatus = statusesMappedByConsent[consent.uid];
            if (!consentStatus) {
                consent.actions = [];
                consent.actions.push({
                    name: 'required',
                    version: consent.versions[consent.versions.length - 1].version
                });
                consent.foreignConsentId = consent.uid;
                consent.tpDid = this.model.did;
                await this.EconsentsStatusRepository.createAsync(consent);
            } else {
                const lastVersion = consentStatus.actions[consentStatus.actions.length - 1].version;
                if (lastVersion < consent.versions[consent.versions.length - 1].version) {
                    consentStatus.actions.push({
                        name: 'required',
                        version: consent.versions[consent.versions.length - 1].version
                    });
                    await this.EconsentsStatusRepository.updateAsync(consentStatus.uid, consentStatus);
                }
            }
        }
    }

    _updateTrialParticipant(data, callback) {
        this.TPService.getTp( (err, tpDsu)=>{
            tpDsu.tp.number = data.tpNumber;
            this.TPService.updateTp(tpDsu,callback);
        });
    }

    async _saveVisit(visitToBeAdded) {
        console.log(visitToBeAdded)
        this.VisitsAndProceduresRepository.filter(`id == ${visitToBeAdded.id}`, 'ascending', 1, (err, visits) => {
            if (err || visits.length === 0) {
                return;
            }
            if(visits[0].proposedDate) {
                this.VisitsAndProceduresRepository.update(visits[0].pk, visitToBeAdded, () => {
                })
            }
        })
        const visitCreated = await this.VisitsAndProceduresRepository.createAsync(visitToBeAdded.uid, visitToBeAdded);
        this.model.tp.hasNewVisits = true;
        await this.TPService.updateTpAsync(this.model.tp)
        return visitCreated;
    }

}
