import ConsentStatusMapper from '../../utils/ConsentStatusMapper.js';
import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const CommunicationService = commonServices.CommunicationService;
const PDFService = commonServices.PDFService;
import {getTPService} from "../../services/TPService.js";

const {WebcController} = WebCardinal.controllers;

export default class ConsentPreviewController extends WebcController {
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
        let econsent = this.model.trialConsent.volatile.ifc.find(c => c.uid === this.historyData.consentUid)
        let ecoVersion = this.historyData.versionId;
        this.model.econsent = econsent;
        this.currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);
        let econsentFilePath = this.getEconsentFilePath(econsent, this.currentVersion);
        this.PDFService = new PDFService(this.DSUStorage);
        this.PDFService.displayPDF(econsentFilePath, this.currentVersion.attachment, {scale: 0.6});
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
        this._attachHandlerBack();
    }

    getEconsentFilePath(econsent, currentVersion) {
        return this.TrialConsentService.PATH  + '/' + this.model.trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', (model) => {
            const {versionId, ...state} = this.historyData;
            this.navigateToPageTag('site-consent-history', {
                ...state
            });
        });
    }
}
