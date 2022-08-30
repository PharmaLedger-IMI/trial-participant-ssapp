import DPModel from '../../models/DPModel.js';
import DPService from '../../services/DPService.js';
import {getTPService} from "../../services/TPService.js";

const commonServices = require("common-services");
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const Constants = commonServices.Constants;

const {WebcIonicController} = WebCardinal.controllers;

export default class MyProfileController extends WebcIonicController {
    constructor(...props) {
        super(...props);


        this.dpExists = false;
        this.dpModel = new DPModel();
        this.model = this.dpModel

        this.dpService = DPService.getDPService()

        this.dpService.getDP((err, dpData) => {
            if (err) {
                return console.log(err);
            }
            if (dpData) {
                this.dpExists = true;
                this.dpData = dpData;
                this.dpModel.setDPModel(dpData)
            }
            this.model = {
                dpExists: this.dpExists,
                dp: {
                    ...this.dpModel.getDPModel()
                }
            }
        });
        this.addTagsListeners();

        this._attachHandlerBack();
    }


    findAgeGroup(date) {
        const ageGroups = ['Age 10-30', "Age 30-40", "Age 40-50", "Age 50-60", "Age 60+"];

        const getAge = dateString => {
            let today = new Date();
            let birthDate = new Date(dateString);
            let age = today.getFullYear() - birthDate.getFullYear();
            let m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        let age = getAge(date);

        switch (true) {
            case (age >= 10) && (age <= 30):
                return ageGroups[0];
            case age > 30 && age <= 40:
                return ageGroups[1];
            case age > 40 && age <= 50:
                return ageGroups[2];
            case age > 50 && age <= 60:
                return ageGroups[3];
            case age > 60:
                return ageGroups[4];
            default:
                break;
        }
    }

    getTP(callback) {
        const tpService = getTPService();
        tpService.getTp((err, participant) => {
            if (err) {
                return callback(err);
            }
            callback(undefined, participant.tp)
        })
    }


    addTagsListeners() {
        this.onTagClick('sharing-permissions:save', () => {
            window.WebCardinal.loader.hidden = false;
            let dp = this.model.dp;
            let dpData = {
                contactMe: dp.contactMe.value,
            };

            this.getTP((err, tp) => {

                if(err){
                    return console.error(err);
                }

                if (tp) {
                    let ageGroup = this.findAgeGroup(tp.birthdate);
                    dpData.tp = {
                        name: tp.subjectName,
                        gender: tp.gender,
                        did: tp.did
                    }
                    if (ageGroup) {
                        dpData.tp.ageGroup = ageGroup;
                    }
                }
                if (this.model.dp.contactMe.value === false) {
                    dpData.perm = {
                        wantToShare: false,
                        givePermisionEachTime: false,
                        shareWithHospitals: false,
                        shareWithPharmas: false,
                        shareWithResearchers: false,
                        areaToParticipateCancer: false,
                        areaToParticipateDiabets: false,
                        areaToParticipateCOPD: false
                    }
                } else {
                    dpData.perm = {
                        wantToShare: dp.perm.wantToShare.value,
                        givePermisionEachTime: dp.perm.givePermisionEachTime.value,
                        shareWithHospitals: dp.perm.shareWithHospitals.value,
                        shareWithPharmas: dp.perm.shareWithPharmas.value,
                        shareWithResearchers: dp.perm.shareWithResearchers.value,
                        areaToParticipateCancer: dp.perm.areaToParticipateCancer.value,
                        areaToParticipateDiabets: dp.perm.areaToParticipateDiabets.value,
                        areaToParticipateCOPD: dp.perm.areaToParticipateCOPD.value
                    }
                }

                let dpCreatedOrUpdatedHandler = (err) => {

                    if (err) {
                        return console.log(err);
                    }

                    window.WebCardinal.loader.hidden = true;
                    this.navigateToPageTag("home");
                }

                const communicationService = getCommunicationServiceInstance();

                if (!this.dpExists) {

                    this.dpService.saveDP(dpData, async (err, dpDsuData) => {
                        if (err) {
                            return console.error(err);
                        }
                        await communicationService.sendMessageToIotAdapter({
                            operation: Constants.MESSAGES.PATIENT.CREATE_DP,
                            sReadSSI: dpDsuData.sReadSSI
                        });

                        dpCreatedOrUpdatedHandler();
                    })

                } else {

                    if (this.dpData) {
                        this.dpData = {...this.dpData, ...dpData}
                    }
                    this.dpService.updateDP(this.dpData, dpCreatedOrUpdatedHandler)
                }
            })

        })

    }

    _attachHandlerBack() {
        this.onTagClick('back', () => {
            this.navigateToPageTag('home');
        });
    }

}