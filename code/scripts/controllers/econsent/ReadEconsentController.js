import TrialConsentService from "../../services/TrialConsentService.js";
const commonServices = require('common-services');
const ConsentStatusMapper = commonServices.ConsentStatusMapper;
const BaseRepository = commonServices.BaseRepository;
const CommunicationService = commonServices.CommunicationService;
const PDFService = commonServices.PDFService;
const Constants = commonServices.Constants;
import {getTPService} from "../../services/TPService.js";

const {WebcController} = WebCardinal.controllers;

export default class ReadEconsentController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model.econsent = {};
        this._initServices();
        this.historyData = this.getState();
        this.model.required = {};
        this.model.declined = {};
        this.model.signed = {};
        this.model.withdraw = {};
        this.model.showControls = false;
        this._initHandlers();
    }

    async _initServices() {
        this.TPService = getTPService();
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);
        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate((err, trialConsent) => {
            if (err) {
                return console.log(err);
            }
            this.model.trialConsent = trialConsent;
            this._initConsent();
        });
    }

    _initConsent() {
        let econsent = this.model.trialConsent.volatile.ifc.find(c => c.uid === this.historyData.ecoId)
        let ecoVersion = this.historyData.ecoVersion;
        this.model.econsent = econsent;
        this.currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);
        this.econsentFilePath = this.getEconsentFilePath(econsent, this.currentVersion);
        this.PDFService = new PDFService(this.DSUStorage);
        this.PDFService.displayPDF(this.econsentFilePath, this.currentVersion.attachment, {scale: 0.6});
        this.PDFService.onFileReadComplete(() => {
            this.model.showControls = true;
        });
        this.EconsentsStatusRepository.findAll((err, data) => {
            if (err) {
                return console.error(err);
            }
            let relevantStatuses = data.filter((element) => element.foreignConsentId === this.historyData.ecoId);
            let currentStatus = relevantStatuses.length > 0 ? relevantStatuses[relevantStatuses.length - 1] : {actions: []}
            this.model.status = currentStatus;
            this.model.signed = ConsentStatusMapper.isSigned(this.model.status.actions);
            this.model.declined = ConsentStatusMapper.isDeclined(this.model.status.actions);
            this.model.required = ConsentStatusMapper.isRequired(this.model.status.actions);
            this.model.withdraw = ConsentStatusMapper.isWithdraw(this.model.status.actions);
        });
    }

    _initHandlers() {
        this._attachHandlerDecline();
        this._attachHandlerSign();
        this._attachHandlerBack();
        this._attachHandlerWithdraw();
    }

    getEconsentFilePath(econsent, currentVersion) {
        return this.TrialConsentService.PATH  + '/' + this.model.trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

    _attachHandlerSign() {
        this.onTagEvent('econsent:sign', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.showModalFromTemplate(
                'general/confirmation-alert',
                (event) => {
                    const response = event.detail;
                    if (response) {
                        let operation = ConsentStatusMapper.consentStatuses.signed.name;
                        this.model.status.actions.push({name: operation, version: this.currentVersion.version});
                        this._saveStatus(operation);
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'general/ConfirmationAlertController',
                    disableExpanding: false,
                    disableBackdropClosing: false,
                    question: 'Are you sure you want to sign this econsent? ',
                    title: 'Sign Econsent',
                });
        });

    }

    _attachHandlerDecline() {
        this.onTagEvent('econsent:decline', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.showModalFromTemplate(
                'general/confirmation-alert',
                (event) => {
                    const response = event.detail;
                    if (response) {
                        let operation = ConsentStatusMapper.consentStatuses.decline.name;
                        this.model.status.actions.push({name: operation, version: this.currentVersion.version});
                        this._saveStatus(operation);
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'general/ConfirmationAlertController',
                    disableExpanding: false,
                    disableBackdropClosing: false,
                    question: 'Are you sure you want to decline this consent?',
                    title: 'Decline Confirmation',
                });
        });
    }

    _attachHandlerWithdraw() {
        this.onTagEvent('econsent:withdraw', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            let latestStatus = this.model.status.actions[this.model.status.actions.length - 1].name;
            this.showModalFromTemplate(
                'econsent/withdraw-econsent',
                (event) => {
                    const response = event.detail;
                    if (response.withdraw) {
                        let operation = ConsentStatusMapper.consentStatuses.withdraw.name;
                        this.model.status.actions.push({name: operation, version:this.currentVersion.version});
                        this._saveStatus(operation);
                    }
                },
                (event) => {
                    const response = event.detail;
                },
                {
                    controller: 'econsent/WithdrawEconsent',
                    disableExpanding: false,
                    disableFooter: true,
                    disableBackdropClosing: false,
                    title: 'Decline Econsent',
                });
        });
    }

    sendMessageToHCO(action, ssi, shortMessage) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate());

        let sendObject = {
            operation: Constants.MESSAGES.HCO.UPDATE_ECONSENT,
            ssi: ssi,
            useCaseSpecifics: {
                trialSSI: this.historyData.trialuid,
                tpNumber: this.tp.number,
                tpDid: this.tp.did,
                version: this.historyData.ecoVersion,
                siteSSI: this.tpData.site?.keySSI,
                action: {
                    name: action,
                    date: currentDate.toISOString(),
                    toShowDate: currentDate.toLocaleDateString(),
                    consentType: this.model.status.type,
                },
            },
            shortDescription: shortMessage,
        };
        this.CommunicationService.sendMessage(this.tpData.hcoIdentity, sendObject);
    }

    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();
        });
    }

    async _saveStatus(operation) {
        this.tpData = await this.TPService.getTpAsync();
        this.tp = this.tpData.tp;
        const digitalSignatureOptions = {
            path: this.econsentFilePath,
            version: this.currentVersion.attachment,
            signatureDate: `Digital Signature ${new Date().toLocaleDateString()}`,
            signatureAuthor: "Trial Participant Signature",
            signatureDid: this.tp.did,
            isBottomSide: false
        };
        this.PDFService.applyDigitalSignature(digitalSignatureOptions);

        if (this.model.status === undefined || this.model.status.uid === undefined) {
            //TODO implement when status is not set => optional consents
            return;
        }
        await this.EconsentsStatusRepository.updateAsync(this.model.status.uid, this.model.status);
        this.sendMessageToHCO(operation, this.model.econsent.keySSI, 'Tp ' + operation);
        this._finishActionSave();
    }

    _finishActionSave() {
        this.navigateToPageTag('trial', {
            uid: this.historyData.trialuid
        });
    }
}
