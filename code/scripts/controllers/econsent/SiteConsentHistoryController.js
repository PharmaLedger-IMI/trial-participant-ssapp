import TrialConsentService from "../../services/TrialConsentService.js";
import ConsentStatusMapper from "../../utils/ConsentStatusMapper.js";

const commonServices = require('common-services');
const DateTimeService = commonServices.DateTimeService;
const BaseRepository = commonServices.BaseRepository;
const {WebcController} = WebCardinal.controllers;

export default class SiteConsentHistoryController extends WebcController {
    constructor(...props) {
        super(...props);

        this._initServices();
        this._attachHandlerBack();
        this._attachHandlerPreview();
    }

    _initServices() {
        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate(async (err, trialConsent) => {
            if (err) {
                return console.log(err);
            }
            this.model.trialConsent = trialConsent;
            let consent = this.model.trialConsent.volatile?.ifc[0];
            this.model.consentUid = consent.uid;
            this.model.versions = consent.versions.map(version => {
                return {
                    ...version,
                    consentName: consent.name
                }
            })
            this.model.consentName = consent.name;
            let importantVersionDate = consent.versions[consent.versions.length - 1].versionDate;
            this.model.consentDate = DateTimeService.convertStringToLocaleDate(importantVersionDate);
            await this.getConsentStatus();
        });
    }

    async getConsentStatus() {
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);

        let statuses = await this.EconsentsStatusRepository.findAllAsync();
        let status = statuses[0];
        let lastAction;
        if (status && status.actions && status.actions.length > 0) {
            lastAction = status.actions[status.actions.length - 1].name;
        }
        lastAction = lastAction.split('-')
            .filter(action => action.length > 0)
            .map(action => action.charAt(0).toUpperCase() + action.slice(1))
            .join(" ");

        let lastActionStatus = ConsentStatusMapper.getStatus(lastAction);
        if (lastActionStatus !== undefined) {
            lastAction = lastActionStatus.displayValue;
            if (lastAction !== 'Consent Signed') {
                this.model.statusType = 'warning';
            }
        }
        this.model.lastAction = lastAction;
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerPreview() {
        this.onTagClick('navigation:preview',(model) => {
            this.navigateToPageTag('consent-preview',{
                trialUid: this.model.trialConsent.uid,
                versionId: model.version,
                consentUid: this.model.consentUid
            });

        });
    }
}
