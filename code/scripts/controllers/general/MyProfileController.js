import ProfileService from '../../services/ProfileService.js';
import {getTPService} from "../../services/TPService.js";

const commonServices = require("common-services");
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const { getDidServiceInstance } = commonServices.DidService;
const Constants = commonServices.Constants;

const getContactModel = ()=>{
    return {
        emailAddress:"",
        phoneNumber:""
    }
}
const {WebcIonicController} = WebCardinal.controllers;

export default class MyProfileController extends WebcIonicController {


    constructor(...props) {
        super(...props);


        this.profilePictureChanged = false;
        this.profileService = ProfileService.getProfileService();

        this.profileService.getContactData((err, contactData) => {
            if (err) {
                return console.error(err);
            }
            if (contactData) {
                this.model.contactData = contactData
            } else {
                this.model.contactData = getContactModel();
            }
        });

        this.profileService.getProfilePicture((err, data) => {
            this.model.profilePicture = data
        });
        this.didService = getDidServiceInstance();
        this.didService.getDID().then(did => {
            this.model.publicDid = did;
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


    addTagsListeners() {
        this.onTagClick('profile:save', () => {
            window.WebCardinal.loader.hidden = false;
            const communicationService = getCommunicationServiceInstance();

            const updateContactInformation = (callback) => {
                this.profileService.saveContactData(this.model.toObject("contactData"), callback);
            }

            if (this.profilePictureChanged) {
                return this.profileService.saveProfilePicture(this.model.profilePicture, () => {
                    updateContactInformation(()=>{
                        window.WebCardinal.loader.hidden = true;
                        this.navigateToPageTag("home");
                    })

                })
            }

            updateContactInformation(()=>{
                window.WebCardinal.loader.hidden = true;
                this.navigateToPageTag("home");
            })

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