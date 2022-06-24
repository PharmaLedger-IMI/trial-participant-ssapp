import { saveNotification } from './commons/index.js';
import {getTPService} from "./../TPService.js";
import TrialService from "./../TrialService.js";
import TrialConsentService from "./../TrialConsentService.js";

const commonServices = require('common-services');
const CONSTANTS = commonServices.Constants;
const TPService = getTPService();
const trialService = new TrialService();
const trialConsentService = new TrialConsentService();


async function update_tpNumber(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.NEW_TPNUMBER);
    return data;
}

async function send_hco_dsu_to_patient(originalMessage) {
    const trialData = await _handleAddToTrial(originalMessage, CONSTANTS.NOTIFICATIONS_TYPE.NEW_TRIAL);
    return { trialData, originalMessage};
}

async function send_refresh_consents(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.NEW_CONSENTS);
    const trialConsentData = await _mountICFAndSaveConsentStatuses(data);
    return trialConsentData;
}

async function _saveTrialParticipantInfo(hcoIdentity, data) {
    let trialParticipant = {
        did: data.tp.did,
        site: data.site,
        tp: {
            subjectName: data.tp.subjectName,
            gender: data.tp.gender,
            birthdate: data.tp.birthdate,
            did: data.tp.did
        },
        hcoIdentity: hcoIdentity,
        sponsorIdentity: data.sponsorIdentity
    }

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

export { update_tpNumber, send_hco_dsu_to_patient, send_refresh_consents}