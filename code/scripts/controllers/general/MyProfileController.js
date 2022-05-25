import DPModel from '../../models/DPModel.js';
import DPService from '../../services/DPService.js';
import ProfileService from '../../services/ProfileService.js';
import {getTPService} from "../../services/TPService.js";


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
        this.profileService.getProfilePicture((err,data)=>{
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
        tpService.getTp((err, tp)=>{
            if(err){
                return console.log(err);
            }
            this.model.name = tp.subjectName;
        })

    }

    addTagsListeners() {

        this.onTagClick('profile:save', () => {
            let dp = this.model.dp;
            let dpData = {
                name: dp.name.value,
                contactMe: dp.contactMe.value,
                wantToShare: dp.wantToShare.value,
                givePermisionEachTime: dp.givePermisionEachTime.value,
                shareWithHospitals: dp.shareWithHospitals.value,
                shareWithPharmas: dp.shareWithPharmas.value,
                shareWithResearchers: dp.shareWithResearchers.value,
                areaToParticipateCancer: dp.areaToParticipateCancer.value,
                areaToParticipateDiabets: dp.areaToParticipateDiabets.value,
                areaToParticipateCOPD: dp.areaToParticipateCOPD.value
            }

            let dpCreatedOrUpdatedHandler = (err, profile) => {
                if (err) {
                    return console.log(err);
                }

                console.log(this.profilePictureChanged )

                if (this.profilePictureChanged) {
                    this.profileService.saveProfilePicture(this.model.profilePicture, () =>{
                        this.navigateToPageTag("home");
                    })
                } else {
                    this.navigateToPageTag("home");
                }
            }

            if (!this.dpExists) {
                this.dpService.saveDP(dpData, dpCreatedOrUpdatedHandler)
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

        profilePictureUpload.addEventListener('change',(data)=>{
            this.profilePictureChanged = true;
            let imageFile = data.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);
        
            reader.onload = (evt)=>{
                this.model.profilePicture = evt.target.result
            }}) 
    }

}