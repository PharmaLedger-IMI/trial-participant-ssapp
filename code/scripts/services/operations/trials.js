import { saveNotification, _handleAddToTrial, _mountICFAndSaveConsentStatuses} from './commons/index.js';
const commonServices = require('common-services');
const CONSTANTS = commonServices.Constants;

async function update_tpNumber(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.TRIAL_UPDATES);
    return data;
}

async function send_hco_dsu_to_patient(originalMessage) {
    const trialData = await _handleAddToTrial(originalMessage, CONSTANTS.NOTIFICATIONS_TYPE.NEW_TRIAL);
    return { trialData, originalMessage};
}

async function send_refresh_consents(data) {
    const trialConsentData = await _mountICFAndSaveConsentStatuses(data);
    return trialConsentData;
}

export { update_tpNumber, send_hco_dsu_to_patient, send_refresh_consents}