import {saveNotification } from './commons/index.js';
import TaskService from "../../services/TaskService.js";

const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const CONSTANTS = commonServices.Constants;

async function update_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_UPDATE);
    await _updateVisit(data.useCaseSpecifics.visit);
}

async function schedule_visit(data) {
    await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.NEW_VISIT);
    return data;
}

async function visit_confirmed(data) {
    const taskService = TaskService.getTaskService();

    await saveNotification(data, CONSTANTS.MESSAGES.HCO.COMMUNICATION.TYPE.VISIT_CONFIRMED);

    let visitDetails = data.useCaseSpecifics.visit;
    let visit = {
        task: "Visit",
        tag: "visit-details",
        schedule: {
            startDate: visitDetails.proposedDate,
            endDate: visitDetails.proposedDate,
            repeatAppointment: "daily"
        },
        showTask: "",
        details: {
            name: visitDetails.name,
            procedures: visitDetails.procedures,
        }
    }

    taskService.addTask(visit, (err, tasks) => {
        if (err) {
            return console.error(err);
        }
    });

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

export { update_visit, schedule_visit, visit_confirmed }
