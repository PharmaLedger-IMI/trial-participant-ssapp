import {saveNotification } from './commons/index.js';
import TaskService from "../../services/TaskService.js";

const commonServices = require('common-services');
const Constants = commonServices.Constants;
const BaseRepository = commonServices.BaseRepository;
const CONSTANTS = commonServices.Constants;

async function refresh_visits(data) {
    await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.REFRESH_VISITS);
    const VisitsAndProceduresRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.VISITS);

    let allVisits = await VisitsAndProceduresRepository.findAllAsync();
    for(let i = 0; i < allVisits.length; i++) {
        await VisitsAndProceduresRepository.deleteRecordAsync(allVisits[i].pk);
    }

    const taskService = TaskService.getTaskService();
    taskService.getTasks(async (err,tasks) => {
        if(err) {
            return console.error(err);
        }
        tasks.item = [];

        taskService.updateTasks(tasks,(err) => {
            if(err) {
                console.error(err);
            }
        })
    })
}

async function update_visit(data) {
    await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.VISIT_UPDATE);
    await _updateVisit(data.useCaseSpecifics.visit);
}

async function schedule_visit(data) {
    await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.NEW_VISIT);
    return data;
}

async function visit_confirmed(data) {
    await _updateVisit(data.useCaseSpecifics.visit);
    const taskService = TaskService.getTaskService();

    let visitDetails = data.useCaseSpecifics.visit;
    let visit = {
        uuid: visitDetails.uuid,
        task: "Visit",
        tag: "visit-details",
        schedule: {
            startDate: visitDetails.proposedDate,
            endDate: visitDetails.proposedDate,
            frequencyType: "daily"
        },
        showTask: "",
        details: {
            name: visitDetails.name,
            details: visitDetails.details,
            procedures: visitDetails.procedures,
        }
    }

    if(data.shortDescription === Constants.MESSAGES.HCO.COMMUNICATION.TYPE.UPDATE_VISIT){
        await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.VISIT_DETAILS_UPDATED);

    } else await saveNotification(data, CONSTANTS.PATIENT_NOTIFICATIONS_TYPE.VISIT_CONFIRMED);

    taskService.getTasks((err,tasks) => {
        if(err) {
            return console.error(err);
        }
        let index = tasks.item.findIndex(t => t.uuid === visit.uuid);
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

    VisitsAndProceduresRepository.filter(`uuid == ${visitToBeUpdated.uuid}`, 'ascending', 1, (err, visits) => {
        if (err || visits.length === 0) {
            return;
        }
        VisitsAndProceduresRepository.update(visits[0].pk, visitToBeUpdated, () => {
        })
    })
}

export { refresh_visits, update_visit, schedule_visit, visit_confirmed }
