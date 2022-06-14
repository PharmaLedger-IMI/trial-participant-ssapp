import {getTPService} from "../../TPService.js";
import TrialService from "../../TrialService.js";
import TrialConsentService from "../../TrialConsentService.js";

const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const TPService = getTPService();
const trialService = new TrialService();
const trialConsentService = new TrialConsentService();
const QuestionsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.QUESTIONS);

async function saveNotification(message, type) {
    const NotificationsRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.NOTIFICATIONS);

    let notification = {
        ...message,
        uid: message.ssi,
        viewed: false,
        date: Date.now(),
        type: type
    }

    return await NotificationsRepository.createAsync(notification.uid, notification);
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

function _updateQuestion(data) {
    if (data.question) {
        QuestionsRepository.update(data.question.pk, data.question, () => {
        })
    }
}

async function _saveTrialParticipantInfo(hcoIdentity, data) {
    let trialParticipant = {
        did: data.tp.did,
        site: data.site,
        tp: {
            subjectName: data.tp.subjectName,
            gender: data.tp.gender,
            birthdate: data.tp.birthdate,
            anonymizedDid: data.tp.anonymizedDid
        },
        hcoIdentity: hcoIdentity,
        sponsorIdentity: data.sponsorIdentity
    }

    await TPService.createTpAsync(trialParticipant);
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

export { saveNotification ,_updateVisit, _updateQuestion, _handleAddToTrial , mountTrial,
    _mountICFAndSaveConsentStatuses }