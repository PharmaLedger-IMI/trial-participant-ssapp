const commonServices = require('common-services');
import {saveNotification } from './commons/index.js';
const BaseRepository = commonServices.BaseRepository;
const CONSTANTS = commonServices.Constants;

async function update_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_UPDATE);
    await _updateVisit(data.useCaseSpecifics.visit);
}

async function schedule_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_SCHEDULED);
    return data;
}

async function _updateVisit(visitToBeUpdated) {
    const VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS);

    VisitsAndProceduresRepository.filter(`id == ${visitToBeUpdated.id}`, 'ascending', 1, (err, visits) => {
        if (err || visits.length === 0) {
            return;
        }
        VisitsAndProceduresRepository.update(visits[0].pk, visitToBeUpdated, () => {
        })
    })
}

export { update_visit, schedule_visit }
