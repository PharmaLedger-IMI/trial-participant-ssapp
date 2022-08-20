import TrialService from '../../services/TrialService.js';
import ConsentStatusMapper from '../../utils/ConsentStatusMapper.js';
import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const FileDownloaderService = commonServices.FileDownloaderService;
const BaseRepository = commonServices.BaseRepository;

const {WebcController} = WebCardinal.controllers;

export default class EconsentController extends WebcController {
    constructor(...props) {
        super(...props);
        this.setModel({});
        this._initServices();
        this._initHandlers();
        this.model.econsent = {};
        this.model.historyData = this.getState();

        this.model.status = {
            actions: [],
            latest: 'N/A'
        };
    }

    async _initServices() {
        this.TrialService = new TrialService();
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
        this._attachHandlerSignEconsent();
        this._attachHandlerDownload();
        this._attachHandlerVersions();
        this._attachHandlerQuestion();

        this._attachHandlerWithdraw();
        this._attachHandlerBack();
    }

    _initEconsent() {
        let econsent = this.model.trialConsent.volatile.ifc.find(c => c.uid === this.model.historyData.ecoId)
        if (econsent === undefined) {
            return console.log("Econsent does not exist.");
        }
        let ecoVersion = this.model.historyData.ecoVersion;
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
            let status = data.find((element) => element.foreignConsentId === this.model.historyData.ecoId);
            if (status === undefined) {
                return console.log(`Status not found for econsendId ${this.model.historyData.ecoId}`);
            }
            status.actions = status.actions.map((action, index) => {
                return {
                    ...action,
                    index: index + 1,
                };
            });
            this.model.status = status;
            this.model.status.latest = status.actions.length > 0 ? status.actions[status.actions.length - 1].name : 'N/A';
            this.model.signed = ConsentStatusMapper.isSigned(this.model.status.actions);
            this.model.declined = ConsentStatusMapper.isDeclined(this.model.status.actions);
        });
    }

    _attachHandlerSignEconsent() {
        this.onTagClick('econsent:sign-electronically', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('sign-econsent', {...this.model.historyData});
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


    _attachHandlerVersions() {

        this.onTagClick('econsent:versions', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('site-consent-history');
        });
    }

    _attachHandlerQuestion() {
        this.onTagClick('econsent:question', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.navigateToPageTag('ask-question', {...this.model.historyData});
        });
    }

    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();

        });
    }

    _attachHandlerWithdraw() {
        this.on('econsent:withdraw', (event) => {
            this.showModal('withdrawEconsent', {}, (err, response) => {
                if (err) {
                    return console.log(err);
                }
                if (response) {
                    this.model.status.actions.push({name: 'withdraw', version: this.currentVersion.version});
                    this.model.status.latest = 'Withdraw';
                }
                this.EconsentsStatusRepository.update(this.model.status.uid, this.model.status, (err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                });
            });
        });
    }

    getEconsentFilePath(econsent, currentVersion) {
        return this.TrialConsentService.PATH + '/' + this.model.trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

}
