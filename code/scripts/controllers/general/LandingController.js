import TrialService from "../../services/TrialService.js";
import TrialConsentService from "../../services/TrialConsentService.js";
import ProfileService from '../../services/ProfileService.js';
import FeedbackService from "../../services/FeedbackService.js";
import EvidenceService from "../../services/EvidenceService.js";

const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const DidService = commonServices.DidService;
const MessageHandlerService = commonServices.MessageHandlerService;
const healthDataService = commonServices.HealthDataService;
const usecases = WebCardinal.USECASES;
import {getTPService} from "../../services/TPService.js";

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

        this.FeedbackService = new FeedbackService();
        this.EvidenceService = new EvidenceService();
    }

    _initTrials() {
        this.model.trials = [];
        this.TrialService.getTrials((err, data) => {
            if (err) {
                return console.error(err);
            }
            this.model.trials = data;
        });
    }



    _initTrialParticipant() {
        this.model.tp = {};
        this.TPService.getTp((err, tp)=>{
            if(err){
                return console.log("Participant not added to a trial yet");
            }
            this.model.tp = tp;
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

            if (this.model.trials.length) {
                this.navigateToPageTag('trial', {
                    tp: this.model.toObject('tp'),
                    uid: this.model.trials[0].uid,
                    tpNumber: this.model.did
                });
            }
        });
        this.onTagEvent("navigate:task-calendar", "click", () => {
            if (this.model.trials.length && this.model.tp) {
                this.navigateToPageTag('task-calendar', {
                    tpDid: this.model.tp.did,
                    tpUid: this.model.trials[0].uid,
                });
            }
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
        this.QuestionnaireService = new QuestionnaireService();
        this.DeviceAssignationService = new DeviceAssignationService();
        this.TrialService = new TrialService();
        this.TPService = getTPService();
        this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS, this.DSUStorage);
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES, this.DSUStorage);
        this.VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS, this.DSUStorage);
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS, this.DSUStorage);
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
        MessageHandlerService.init(async (data) => {

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
                    await this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_SCHEDULED);
                    this._saveVisit(data.useCaseSpecifics.visit);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.UPDATE_VISIT : {
                    await this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_UPDATE);
                    this._updateVisit(data.useCaseSpecifics.visit);
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.UPDATE_TP_NUMBER: {
                    await this.saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.TRIAL_UPDATES);
                    this._updateTrialParticipant(data.useCaseSpecifics,(err)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                    break;
                }
                case CONSTANTS.MESSAGES.PATIENT.QUESTION_RESPONSE: {
                    //await this.saveNotification(data);
                    this._updateQuestion(data.useCaseSpecifics)
                    break;
                }
                case CONSTANTS.NOTIFICATIONS_TYPE.NEW_FEEDBACK : {
                    this.FeedbackService.mount(data.ssi, (err,data) => {
                        if(err) {
                            return console.error(err);
                        }
                        this.FeedbackService.getFeedbacks((err,feedbacks) => {
                            if(err) {
                                return console.error(err);
                            }
                        })
                    });
                    break;
                }
                case CONSTANTS.NOTIFICATIONS_TYPE.NEW_EVIDENCE : {
                    this.EvidenceService.mount(data.ssi, (err,data) => {
                        if(err) {
                            return console.error(err);
                        }
                        this.EvidenceService.getEvidences((err,evidences) => {
                            if(err) {
                                return console.error(err);
                            }
                        });
                    })
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
                case "CLINICAL-SITE-QUESTIONNAIRE": {
                    this.QuestionnaireService.mount(data.ssi, (err, questionnaire) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    break;
                }
                case "HealthDataDsu": {
                    this.healthDataService.mount(data.sReadSSI, (err, healthData) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log("****************** Health Data ******************************")
                        console.log(healthData)
                    });
                    break;
                }
            }
        });
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
                consent.foreignConsentId = consent.uid;
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
            subjectName: data.subjectName,
            hcoIdentity: hcoIdentity,
            sponsorIdentity: data.sponsorIdentity
        }
        this.TPService.createTp(trialParticipant, (err,tp)=>{
            if(err){
                return console.log(err);
            }
            this.model.tp = tp
        })
    }

    _updateTrialParticipant(data, callback) {
        this.model.tp.number = data.number;
        this.TPService.updateTp(this.model.tp, callback)
    }

    async saveNotification(message, type) {
        let notification = {
            ...message,
            uid: message.ssi,
            viewed: false,
            date: Date.now(),
            type: type
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
            this.TPService.updateTp(this.model.tp, (err)=>{
                if(err){
                    console.log(err);
                }
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
        await this.saveNotification(data, notificationType);
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
