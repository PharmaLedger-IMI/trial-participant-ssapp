const commonServices = require('common-services');
const CONSTANTS = commonServices.Constants;
import {saveNotification, _updateVisit } from './commons/index.js';

async function update_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_UPDATE);
    await _updateVisit(data.useCaseSpecifics.visit);
}

async function schedule_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_SCHEDULED);
    return data;
}

export { update_visit, schedule_visit }
