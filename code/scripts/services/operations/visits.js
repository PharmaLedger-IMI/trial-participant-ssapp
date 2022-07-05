import {saveNotification } from './commons/index.js';
import TaskService from "../../services/TaskService.js";

const commonServices = require('common-services');
const Constants = commonServices.Constants;
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

    let visitDetails = data.useCaseSpecifics.visit;
    let visit = {
        uid: visitDetails.uid,
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
            toRemember: visitDetails.toRemember,
            details: visitDetails.details,
            procedures: visitDetails.procedures,
        }
    }

    if(visitDetails.uuid) {
        visit.uid = visitDetails.uuid;
    }

    if(data.shortDescription === Constants.MESSAGES.HCO.COMMUNICATION.TYPE.UPDATE_VISIT){
        await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_DETAILS_UPDATED);

    } else await saveNotification(data, CONSTANTS.NOTIFICATIONS_TYPE.VISIT_CONFIRMED);

    taskService.getTasks((err,tasks) => {
        if(err) {
            return console.error(err);
        }
        let index = tasks.item.findIndex(t => t.uid === visit.uid);
        if(index === -1) {
            return taskService.addTask(visit, (err, tasks) => {
                if (err) {
                    return console.error(err);
                }
            });
        }
        tasks.item[index] = JSON.parse(JSON.stringify(visit));
        taskService.updateTasks(tasks,(err) => {
            if(err) {
                console.error(err);
            }
        })
    })

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
