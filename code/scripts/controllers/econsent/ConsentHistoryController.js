import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const ConsentStatusMapper = commonServices.ConsentStatusMapper;
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const {WebcController} = WebCardinal.controllers;

export default class ConsentHistoryController extends WebcController {
    constructor(...props) {
        super(...props);
        this.state = this.getState();

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
            this.trialConsent = trialConsent;
            let consents = this.trialConsent.volatile.ifc;
            let consent = consents.find(cons => cons.trialConsentId === this.state.trialConsentId);
            this.consentUid = consent.uid;
            this.model.versions = consent.versions.map(version => {
                return {
                    ...version,
                    consentName: consent.name
                }
            })
            this.model.consentName = consent.name;
            let importantVersionDate = consent.versions[consent.versions.length - 1].versionDate;
            this.model.consentDate = (new Date(importantVersionDate)).toLocaleDateString(Constants.DATE_UTILS.FORMATS.EN_UK);
            this.model.status = this.state.status;
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
            console.log(this.state);
            this.navigateToPageTag('econsent', {
                ...this.state,
            });
        });
    }

    _attachHandlerPreview() {
        this.onTagClick('navigation:preview',(model) => {
            this.navigateToPageTag('consent-preview',{
                trialUid: this.trialConsent.uid,
                versionId: model.version,
                consentUid: this.consentUid,
                ...this.state,
            });

        });
    }
}
