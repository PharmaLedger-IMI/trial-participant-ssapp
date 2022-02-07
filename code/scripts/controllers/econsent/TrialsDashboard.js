import TrialService from '../../services/TrialService.js';
import TrialConsentService from '../../services/TrialConsentService.js';
import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;

const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const BaseRepository = commonServices.BaseRepository;

export default class TrialsDashboard extends WebcController {
    constructor(...props) {
        super(...props);
        this._initServices();
        this._initHandlers();
        this._initTrials();
        this._initTrialParticipant();
    }

    async _initServices() {
        this.TrialService = new TrialService();
        this.TrialParticipantRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.TRIAL_PARTICIPANT, this.DSUStorage);
        this.NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS, this.DSUStorage);
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES, this.DSUStorage);
        this.VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS, this.DSUStorage);
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS, this.DSUStorage);

        this.CommunicationService = await CommunicationService.getCommunicationServiceInstance();
        this.TrialConsentService = new TrialConsentService();
        this.model.trialConsent = await this.TrialConsentService.getOrCreateAsync();
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })
    }

    _initHandlers() {
        this._attachHandlerTrialClick();
        this._attachHandlerVisits();
        this._attachHandlerQuestions();
        this._attachHandlerBack();
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


    //TO BE REMOVED/REFACTORED
    _initTrialParticipant() {
        this.model.tp = {};
        this.TrialParticipantRepository.findAll((err, data) => {
            if (err) {
                return console.log(err);
            }
            if (data && data.length > 0) {
                this.model.tp = data[data.length - 1];
            }
        });
    }


    _attachHandlerTrialClick() {
        this.onTagEvent('home:trial', 'click', (trial, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.navigateToPageTag('trial', {
                trialSSI: trial.keySSI,
                tpDid: this.model.tp.did,
                isNewTp: this.model.isNewTp,
            });
        });
    }

    _attachHandlerQuestions() {
        this.onTagClick('home:questions', (event) => {
            this.navigateToPageTag('questions');
        });
    }

    _attachHandlerVisits() {
        this.onTagClick('home:visits', (event) => {
            this.navigateToPageTag('visits-procedures', {
                tpDid: this.model.tp.did,
                tpUid: this.model.tp.uid
            });
        });
    }
    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.history.goBack();
        });
    }






}
