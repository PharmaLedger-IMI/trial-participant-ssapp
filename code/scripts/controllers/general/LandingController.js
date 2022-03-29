import TrialService from "../../services/TrialService.js";
import TrialConsentService from "../../services/TrialConsentService.js";
import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const DidService = commonServices.DidService;
const MessageHandlerService = commonServices.MessageHandlerService;
const usecases = WebCardinal.USECASES;


const CONSTANTS = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;

export default class LandingController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = JSON.parse(JSON.stringify(usecases));
        this.addHandlers();
        this.initServices();
    }

    addHandlers() {
        this.onTagEvent("navigate:notifications", "click", () => {
            this.navigateToPageTag('notifications');
        });
        this.onTagEvent("navigate:my-profile", "click", () => {
            this.navigateToPageTag('my-profile');
        });
        this.onTagEvent("navigate:econsent-trials-dashboard", "click", () => {
            this.navigateToPageTag('econsent-trials-dashboard');
        });
        this.onTagEvent("navigate:iot-devices", "click", () => {
            this.navigateToPageTag('iot-devices');
        });
        this.onTagEvent("navigate:health-studies", "click", () => {
            this.navigateToPageTag('iot-health-studies');
        });
        this.onTagEvent("navigate:iot-feedback", "click", () => {
            this.navigateToPageTag('iot-feedback');
        });
    }

    async initServices() {
        this._attachMessageHandlers();
        this.model.did = await DidService.getDidServiceInstance().getDID();
        this.TrialService = new TrialService();
        this.TrialParticipantRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.TRIAL_PARTICIPANT, this.DSUStorage);
        this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS,this.DSUStorage);
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES,this.DSUStorage);
        this.VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS,this.DSUStorage);
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS,this.DSUStorage);
        this.TrialConsentService = new TrialConsentService();
        this.model.trialConsent = await this.TrialConsentService.getOrCreateAsync();
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })
    }

    _attachMessageHandlers() {
        MessageHandlerService.init(async (err, data) =>{

        if (err) {
                return console.error(err);
            }

            data = JSON.parse(data);

            let hcoIdentity = data.senderIdentity;

            if (typeof hcoIdentity === "undefined") {
                throw new Error("Sender identity is undefined. Did you forgot to add it?")
            }

            console.log("OPERATION:", data.operation);
            switch (data.operation) {
                case  CONSTANTS.MESSAGES.PATIENT.REFRESH_TRIAL: {
                    this.TrialService.reMountTrial(data.ssi, (err, trial) => {
                        this._saveConsentsStatuses(this.model.trialConsent.volatile.ifc, this.model.tp?.did);
                    });
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.ADD_TO_TRIAL : {
                    this._handleAddToTrial(data, CONSTANTS.NOTIFICATIONS_TYPE.NEW_TRIAL);
                    this._saveConsentsStatuses(this.model.trialConsent.volatile?.ifc?.consents, data.useCaseSpecifics.did);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.SCHEDULE_VISIT : {
                    this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_SCHEDULED);
                    this._saveVisit(data.useCaseSpecifics.visit);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.UPDATE_VISIT : {
                    this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_UPDATE);
                    this._updateVisit(data.useCaseSpecifics.visit);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.UPDATE_TP_NUMBER: {
                    this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.TRIAL_UPDATES);
                    this._updateTrialParticipant(data.useCaseSpecifics);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.QUESTION_RESPONSE: {
                    //this.saveNotification(data);
                    this._updateQuestion(data.useCaseSpecifics)
                    break;
                }
                case CONSTANTS.MESSAGES.HCO.SEND_HCO_DSU_TO_PATIENT: {
                    this._handleAddToTrial(data, CONSTANTS.NOTIFICATIONS_TYPE.NEW_TRIAL);
                    this._mountHCODSUAndSaveConsentStatuses(data, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        this._sendTrialConsentToHCO(hcoIdentity);
                    });
                    break;
                }
                case CONSTANTS.MESSAGES.HCO.SEND_REFRESH_CONSENTS_TO_PATIENT: {
                    await this._mountICFAndSaveConsentStatuses(data);
                    break;
                }
            }
        });
    }

    _sendTrialConsentToHCO(hcoIdentity) {
        let sendObject = {
            operation: CONSTANTS.MESSAGES.PATIENT.SEND_TRIAL_CONSENT_DSU_TO_HCO,
            ssi: this.TrialConsentService.ssi,
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


    async _mountICFAndSaveConsentStatuses(data) {
        let trialConsent = await this.TrialConsentService.mountIFCAsync(data.ssi);
        this.model.trialConsent = trialConsent;
        await this._saveConsentsStatuses(this.model.trialConsent.volatile?.ifc, data.useCaseSpecifics.did);
    }

    async _saveConsentsStatuses(consents, did) {
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
            let status = statusesMappedByConsent[consent.uid];
            if (!status) {
                consent.actions = [];
                consent.actions.push({name: 'required'});
                consent.foreignConsentId = consent.keySSI;
                consent.tpDid = did;
                await this.EconsentsStatusRepository.createAsync(consent);
            }
        }
    }

    async _saveTrialParticipantInfo(hcoIdentity, data) {
        let trialParticipant = {
            name: data.tpName,
            did: data.tpDid,
            site: data.site,
            hcoIdentity: hcoIdentity,
            sponsorIdentity: data.sponsorIdentity
        }
        this.model.tp = await this.TrialParticipantRepository.createAsync(trialParticipant);
    }

    async _updateTrialParticipant(data) {
        this.model.tp.number = data.number;
        await this.TrialParticipantRepository.updateAsync(this.model.tp.uid, this.model.tp);
    }

    async saveNotification(message, type) {
        let notification = {
            ...message,
            uid: message.ssi,
            viewed: false,
            date: Date.now(),
            type:type
        }
        await this.NotificationsRepository.createAsync(notification, () => {
        });
    }

    async mountTrial(trialSSI) {
        let trial = await this.TrialService.mountTrialAsync(trialSSI);
        this.model.trials?.push(trial);
    }


    _saveVisit(visitToBeAdded) {
        this.VisitsAndProceduresRepository.createAsync(visitToBeAdded.uid, visitToBeAdded, (err, visitCreated) => {
            if (err) {
                return console.error(err);
            }
            this.model.tp.hasNewVisits = true;
            this.TrialParticipantRepository.update(this.model.tp.uid, this.model.tp, () => {
            })
        })
    }

    _updateVisit(visitToBeUpdated) {
        this.VisitsAndProceduresRepository.filter(`id == ${visitToBeUpdated.id}`, 'ascending', 1, (err, visits) => {
            if (err || visits.length === 0) {
                return;
            }
            this.VisitsAndProceduresRepository.update(visits[0].pk, visitToBeUpdated, () => {
            })
        })
    }


    async _handleAddToTrial(data, notificationType) {
        this.saveNotification(data, notificationType);
        let hcoIdentity = data.senderIdentity;
        await this._saveTrialParticipantInfo(hcoIdentity, data.useCaseSpecifics);
        await this.mountTrial(data.useCaseSpecifics.trialSSI);
    }

    _updateQuestion(data) {
        if (data.question) {
            this.QuestionsRepository.update(data.question.pk, data.question, () => {
            })
        }
    }

}
