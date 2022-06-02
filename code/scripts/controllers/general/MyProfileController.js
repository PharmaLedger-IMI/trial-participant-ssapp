import DPModel from '../../models/DPModel.js';
import DPService from '../../services/DPService.js';
import ProfileService from '../../services/ProfileService.js';
import {getTPService} from "../../services/TPService.js";

const commonServices = require("common-services");
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const Constants = commonServices.Constants;


const {WebcIonicController} = WebCardinal.controllers;

export default class MyProfileController extends WebcIonicController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};

        this.dpExists = false;
        this.dpModel = new DPModel();
        this.model = this.dpModel

        this.profilePictureChanged = false;
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err, data) => {
            this.model.profilePicture = data
            console.log(this.model)
        })

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
        this.getParticipantName();
        this.addTagsListeners();
        this.addProfilePictureHandler();

        this._attachHandlerBack();
    }

    async getParticipantName() {
        const tpService = getTPService();
        tpService.getTp((err, participant) => {
            if (err) {
                return console.log(err);
            }
            this.model.tp = participant.tp;
        })
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
                break;
            case age > 30 && age <= 40:
                return ageGroups[1];
                break;
            case age > 40 && age <= 50:
                return ageGroups[2];
                break;
            case age > 50 && age <= 60:
                return ageGroups[3];
                break;
            case age > 60:
                return ageGroups[4];
                break;
            default:
                break;
        }
    }

    addTagsListeners() {
        this.onTagClick('profile:save', () => {
            let dp = this.model.dp;
            let dpData = {
                contactMe: dp.contactMe.value,
            };
            if (this.model.tp) {
                let ageGroup = this.findAgeGroup(this.model.tp.birthdate);
                dpData.tp = {
                    name: this.model.tp.subjectName,
                    gender: this.model.tp.gender,
                    did: this.model.tp.anonymizedDid,
                    ageGroup: ageGroup
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

            let dpCreatedOrUpdatedHandler = (err, profile) => {
                if (err) {
                    return console.log(err);
                }

                if (this.profilePictureChanged) {
                    this.profileService.saveProfilePicture(this.model.profilePicture, () => {
                        this.navigateToPageTag("home");
                    })
                } else {
                    this.navigateToPageTag("home");
                }
            }

            const communicationService = getCommunicationServiceInstance();

            if (!this.dpExists) {
                this.dpService.saveDP(dpData, async (err, profile) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('profile', profile);

                    await communicationService.sendMessageToIotAdapter({
                        operation: Constants.MESSAGES.PATIENT.PROFILE_CREATED,
                        sReadSSI: profile.sReadSSI
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

    }

    _attachHandlerBack() {
        this.onTagClick('back', () => {
            this.navigateToPageTag('home');
        });
    }

    addProfilePictureHandler() {
        const profilePictureUpload = this.querySelector('#profileImageUpload')

        profilePictureUpload.addEventListener('change', (data) => {
            this.profilePictureChanged = true;
            let imageFile = data.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);

            reader.onload = (evt) => {
                this.model.profilePicture = evt.target.result
            }
        })
    }

}