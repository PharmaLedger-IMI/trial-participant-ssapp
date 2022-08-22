import TrialService from '../../services/TrialService.js';
import TrialConsentService from "../../services/TrialConsentService.js";
const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const {WebcController} = WebCardinal.controllers;

export default class EconsentVersionsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.versions = [];
        let receivedObject = this.getState();
        this.model.trialSSI = receivedObject.trialSSI;
        this.model.econsentSSI = receivedObject.econsentSSI;
        this.model.tpDid = receivedObject.tpDid;
        this._initServices();
        this._initHandlers();
        this._initTrialAndConsent();
    }

    _initServices() {
        this.TrialService = new TrialService();
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);
    }

    _initHandlers() {
        this._attachHandlerBack();
    }

    _initTrialAndConsent() {
        this.TrialService.getTrial(this.model.trialSSI, (err, trial) => {
            if (err) {
                return console.log(err);
            }
            this.model.trial = trial;
        });
        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate((err, trialConsent) => {
            if (err) {
                return console.log(err);
            }
            this.model.trialConsent = trialConsent;
        });

        // this.TrialService.getEconsent(this.model.trialSSI, this.model.econsentSSI, (err, data) => {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     this.model.econsent = data;
        //
        //     this.model.versions = data.versions;
        // });
    }


    _attachHandlerBack() {
        this.onTagEvent('back', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.history.back();
        });
    }

    _attachHandlerView() {
        this.onTagEvent('consent:view', 'click', (model, target, event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            this.navigateToPageTag('econsent-sign', {
                trialSSI: this.model.trialSSI,
                econsentSSI: model.econsentSSI,
                ecoVersion: model.lastVersion,
                tpDid: this.model.tp.did,
                controlsShouldBeVisible: false
            });
        });
    }
}
