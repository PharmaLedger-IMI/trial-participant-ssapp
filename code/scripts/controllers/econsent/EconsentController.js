import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const ConsentStatusMapper = commonServices.ConsentStatusMapper;
const FileDownloaderService = commonServices.FileDownloaderService;
const BaseRepository = commonServices.BaseRepository;

const {WebcController} = WebCardinal.controllers;

export default class EconsentController extends WebcController {
    constructor(...props) {
        super(...props);
        this._initServices();
        this._initHandlers();
        this.model.econsent = {};
        this.historyData = this.getState();

        this.model.status = {
            actions: [],
            latest: 'N/A'
        };
    }

    async _initServices() {
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);

        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate((err, trialConsent) => {
            if (err) {
                return console.log(err);
            }
            this.model.trialConsent = trialConsent;
            this._initEconsent();
        });
    }

    _initHandlers() {
        this._attachHandlerBack();
        this._attachHandlerSignEconsent();
        this._attachHandlerDownload();
        this._attachHandlerVersions();
    }

    _initEconsent() {
        let econsent = this.model.trialConsent.volatile.ifc.find(c => c.uid === this.historyData.ecoId)
        if (econsent === undefined) {
            return console.log("Econsent does not exist.");
        }
        let ecoVersion = this.historyData.ecoVersion;
        this.model.econsent = econsent;
        this.currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);
        this.econsentFilePath = this.getEconsentFilePath(econsent, this.currentVersion);
        this.fileDownloaderService = new FileDownloaderService(this.DSUStorage);
        this.model.econsent.versionDate = new Date(this.currentVersion.versionDate).toLocaleDateString('sw');
        this.model.econsent.version = this.currentVersion.version;

        this.EconsentsStatusRepository.findAll((err, data) => {
            if (err) {
                return console.error(err);
            }
            let status = data.find((element) => element.foreignConsentId === this.historyData.ecoId);
            if (status === undefined) {
                return console.log(`Status not found for econsendId ${this.historyData.ecoId}`);
            }
            status.actions = status.actions.map((action, index) => {
                return {
                    ...action,
                    index: index + 1,
                };
            });
            this.model.status = status;
            this.model.status.latest = status.actions.length > 0 ? status.actions[status.actions.length - 1].name : 'N/A';
        });
    }

    _attachHandlerSignEconsent() {
        this.onTagClick('econsent:sign-electronically', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('sign-econsent', {...this.historyData});
        });

    }


    _attachHandlerDownload() {
        this.onTagClick('econsent:download', async (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            await this.fileDownloaderService.prepareDownloadFromDsu(this.econsentFilePath, this.currentVersion.attachment);
            this.fileDownloaderService.downloadFileToDevice(this.currentVersion.attachment);
        });
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('trial');
        });
    }


    _attachHandlerVersions() {

        this.onTagClick('econsent:versions', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('site-consent-history', {
                trialConsentId: model.econsent.trialConsentId,
                status: this.model.status.latest,
                ...this.historyData
            });
        });
    }

    getEconsentFilePath(econsent, currentVersion) {
        return this.TrialConsentService.PATH + '/' + this.model.trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

}
