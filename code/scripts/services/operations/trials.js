import {saveNotification} from './commons/index.js';
import {getTPService} from "./../TPService.js";
import TrialService from "./../TrialService.js";
import TrialConsentService from "./../TrialConsentService.js";

const commonServices = require('common-services');
const JWTService = commonServices.JWTService;
const CONSTANTS = commonServices.Constants;

const JWTServiceInstance = new JWTService();
const TPService = getTPService();
const trialService = new TrialService();
const trialConsentService = new TrialConsentService();


function update_status(data){
    TPService.getTp( (err, tpDsu)=>{
        tpDsu.tp.status = data.status;
        TPService.updateTp(tpDsu,async ()=>{
            await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.UPDATE_STATUS);
        });
    });
}

async function update_tpNumber(data) {
    await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.NEW_TPNUMBER);
    return data;
}

async function send_hco_dsu_to_patient(originalMessage) {
    const existingTrials = await trialService.getTrialsAsync();

    if (existingTrials.length > 0) {
        return {
            err:CONSTANTS.TRIAL_PARTICIPANT_STATUS.UNAVAILABLE, originalMessage
        }
    }

    const trialData = await _handleAddToTrial(originalMessage, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.NEW_TRIAL);
    return { trialData, originalMessage};
}

async function send_refresh_consents(data) {
    const tpDSU = await TPService.getTpAsync()
    if (tpDSU.tp.did === data.useCaseSpecifics.did) {
        await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.NEW_CONSENTS);
        return await _mountICFAndSaveConsentStatuses(data);
    }
    return {
        err: CONSTANTS.TRIAL_PARTICIPANT_STATUS.UNAVAILABLE
    }
}

async function _saveTrialParticipantInfo(hcoIdentity, data) {
    const {verifyCredentialStatus} = await JWTServiceInstance.verifyCredential(data.tp.anonymousDIDVc);
    const anonymizedDID = verifyCredentialStatus.vc.credentialSubject.anonymizedDID;

    let trialParticipant = {
        did: anonymizedDID,
        site: data.site,
        tp: {
            status:data.tp.status,
            subjectName: data.tp.subjectName,
            gender: data.tp.gender,
            birthdate: data.tp.birthdate,
            did: anonymizedDID
        },
        hcoIdentity: hcoIdentity,
        sponsorIdentity: data.sponsorIdentity
    };

    return await TPService.createTpAsync(trialParticipant);
}

async function _handleAddToTrial(data, notificationType) {
    await saveNotification(data, notificationType);
    let hcoIdentity = data.senderIdentity;
    const tp = await _saveTrialParticipantInfo(hcoIdentity, data.useCaseSpecifics);
    const trial = await mountTrial(data.useCaseSpecifics.trialSSI);
    return { tp, trial};
}

async function mountTrial(trialSSI) {
    return await trialService.mountTrialAsync(trialSSI);
}

async function _mountICFAndSaveConsentStatuses(data) {
    const trialConsent = await trialConsentService.mountIFCAsync(data.ssi);
    return { trialConsent }
}

export { update_tpNumber, update_status, send_hco_dsu_to_patient, send_refresh_consents}