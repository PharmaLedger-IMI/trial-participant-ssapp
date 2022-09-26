import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const PDFService = commonServices.PDFService;

const {WebcController} = WebCardinal.controllers;

export default class ConsentPreviewController extends WebcController {
    constructor(...props) {
        super(...props);
        this.historyData = this.getState();
        this._initServices();
        this._attachHandlerBack();
    }

    async _initServices() {
        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate((err, trialConsent) => {
            if (err) {
                return console.log(err);
            }

            this._initConsent(trialConsent);
        });
    }

    _initConsent(trialConsent) {
        let econsent = trialConsent.volatile.ifc.find(c => c.uid === this.historyData.consentUid)
        let ecoVersion = this.historyData.versionId;
        this.currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);
        let econsentFilePath = this.getEconsentFilePath(trialConsent, econsent, this.currentVersion);
        this.PDFService = new PDFService(this.DSUStorage);
        this.PDFService.displayPDF(econsentFilePath, this.currentVersion.attachment, {scale: 0.6});
    }

    getEconsentFilePath(trialConsent, econsent, currentVersion) {
        return this.TrialConsentService.PATH  + '/' + trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', (model) => {
            const {versionId, ...state} = this.historyData;
            this.navigateToPageTag('consent-history', {
                ...state
            });
        });
    }
}
