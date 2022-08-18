import TrialService from '../../services/TrialService.js';
import EconsentService from "../../services/EconsentService.js";


const commonServices = require('common-services');
const CommunicationService = commonServices.CommunicationService;
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
import {getTPService}  from "../../services/TPService.js"
const {WebcController} = WebCardinal.controllers;


export default class AsqQuestionController extends WebcController {

    question = {
        name: "question",
        placeholder: "Insert your question here "
    };

    constructor(...props) {
        super(...props);
        this.setModel({});
        this.model.econsent = {};
        this.model.question = this.question;
        this._initServices();
        this.model.historyData = this.getState();
        this._initConsent();
        this._initHandlers();
    }

    _initServices() {
        this.TPService = getTPService();
        this.TrialService = new TrialService();
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.EcosentService = new EconsentService();
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);
        this.QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS);
    }

    _initConsent() {
        this.TrialService.getEconsent(this.model.historyData.trialuid, this.model.historyData.ecoId, (err, econsent) => {
            if (err) {
                return console.log(err);
            }
            let ecoVersion = this.model.historyData.ecoVersion;
            this.model.econsent = econsent;
            let currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);


        });
    }

    _initHandlers() {
        this._attachHandlerSubmit();
        this._attachHandlerBack();
    }


    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();

        });
    }


    _attachHandlerSubmit() {
        this.onTagEvent('question-submit', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate());
            let question = {
                trialUID: this.model.historyData.trialuid,
                ecoUID: this.model.historyData.ecoId,
                ecoVersion: this.model.historyData.ecoVersion,
                tpDID: this.model.historyData.tpDID,
                question: this.model.question.value,
                date: currentDate

            }

            this.showModalFromTemplate(
                'general/confirmation-alert',
                (event) => {
                    const response = event.detail;
                    if (response) {

                        this._saveQuestion(question);
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'general/ConfirmationAlertController',
                    disableExpanding: false,
                    disableBackdropClosing: false,
                    question: 'Are you sure you want to send the question to HCO ?',
                    title: 'Send Question',
                });
        });
    }

    async _saveQuestion(questionToBeAdded) {
        let quest = await this.QuestionsRepository.createAsync(questionToBeAdded);
        this.sendMessageToHCO(Constants.MESSAGES.HCO.ASQ_QUESTION, '', 'Patient asked a new question ', quest);
    }

    sendMessageToHCO(action, ssi, shortMessage, question) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate());

        this.TPService.getTp((err, tp) => {
            if (err) {
                return console.log(err);
            }
            this.model.tp = tp;
            question.patient = this.model.tp.did;
            question.ecoVersion = this.model.historyData.ecoVersion;
            let sendObject = {
                operation: 'ask-question',
                ssi: ssi,
                useCaseSpecifics: {
                    trialSSI: this.model.historyData.trialuid,
                    tpNumber: this.model.tp.number,
                    tpDid: this.model.tp.did,
                    version: this.model.historyData.ecoVersion,

                    question: {
                        ...question
                    },
                },
                shortDescription: shortMessage,
            };

            this.CommunicationService.sendMessage(this.model.tp.hcoIdentity, sendObject);
            this.navigateToPageTag('econsent-trials-dashboard');
        });
    }

}
