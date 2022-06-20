import TrialService from "../../services/TrialService.js";
import TrialConsentService from "../../services/TrialConsentService.js";
import ProfileService from '../../services/ProfileService.js';
import FeedbackService from "../../services/FeedbackService.js";
import EvidenceService from "../../services/EvidenceService.js";
import {getTPService} from "../../services/TPService.js";
import {getOperationsHookRegistry} from '../../services/operations/operationsHookRegistry.js';
import handlerOperations from "../../services/MessageHandlerStrategy.js";

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
        this.model.numberOfNewConsents = 0;

        this.FeedbackService = new FeedbackService();
        this.EvidenceService = new EvidenceService();
        this.healthDataService = new HealthDataService();
        this.OperationsHookRegistry = getOperationsHookRegistry();
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
                this.navigateToPageTag('trial', {
                    tp: this.model.toObject('tp'),
                    uid: this.model.trials[0].uid,
                    tpNumber: this.model.did
                });
            }
        });
        this.onTagEvent("navigate:task-calendar", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag('task-calendar', {
                    tpDid: this.model.tp.did,
                    tpUid: this.model.trials[0].uid,
                });
            }
        });
        this.onTagEvent("navigate:iot-devices", "click", () => {
            if (!this.model.notAssigned) {
                // this.navigateToPageTag('iot-devices');
                this.navigateToPageTag("iot-data-selection");
            }
        });
        this.onTagEvent("navigate:health-studies", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag('iot-health-studies');
            }
        });
        this.onTagEvent("navigate:iot-feedback", "click", () => {
            if (!this.model.notAssigned) {
                this.navigateToPageTag('iot-feedback');
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
            if (data.originalMessage.useCaseSpecifics.tp.anonymizedDid) {
                let communicationService = CommunicationService.getExtraCommunicationService(data.originalMessage.useCaseSpecifics.tp.anonymizedDid);
                communicationService.listenForMessages(async (err, message) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('message received for anonymized did', message);
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

            if(this.model.trialConsent.volatile?.ifc.length) {
                this.model.numberOfNewConsents++;
                this.model.consentsReceived = true;
            } else this.model.consentsReceived = false;

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

        this.OperationsHookRegistry.register(CONSTANTS.NOTIFICATIONS_TYPE.VISIT_SCHEDULED, async(err, data) => {
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
        this.model.tp.number = data.number;
        this.TPService.updateTp(this.model.tp, callback)
    }

    async _saveVisit(visitToBeAdded) {
        const visitCreated = await this.VisitsAndProceduresRepository.createAsync(visitToBeAdded.uid, visitToBeAdded);
        this.model.tp.hasNewVisits = true;
        await this.TPService.updateTpAsync(this.model.tp)
        return visitCreated;
    }

}
