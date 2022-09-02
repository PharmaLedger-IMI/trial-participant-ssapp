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
        this.CommunicationService = getCommunicationServiceInstance();

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
        this.validateInputs();
    }

    validateInputs() {
        this.model.isBtnDisabled = true;
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        const observeInputs = () => {
            if (this.model.contactData.emailAddress.trim() !== '' && validateEmail(this.model.contactData.emailAddress) &&
                this.model.contactData.phoneNumber.trim() !== '') {
                this.model.isBtnDisabled = false;
            } else this.model.isBtnDisabled = true;
        }

        this.model.onChange('contactData.emailAddress', observeInputs)
        this.model.onChange('contactData.phoneNumber', observeInputs)
    }



    async getParticipantName() {
        const tpService = getTPService();
        tpService.getTp((err, participant) => {
            if (err) {
                return console.log(err);
            }
            this.model.tp = participant.tp;
            this.hcoIdentity = participant.hcoIdentity;
        })
    }


    addTagsListeners() {
        this.onTagClick('profile:save', () => {
            window.WebCardinal.loader.hidden = false;
            let contactData = this.model.toObject("contactData");

            const updateContactInformation = (callback) => {
                this.profileService.saveContactData(contactData, (err, contactDataSReadSSI)=>{
                    if (err) {
                        return console.log(err);
                    }
                    this.sendMessageToHCO(this.hcoIdentity, Constants.MESSAGES.PATIENT.TP_CONTACT_DATA, contactDataSReadSSI, "TP updated contact data!");
                    callback();
                });
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

    sendMessageToHCO(siteDID, operation, ssi, shortMessage) {
        this.CommunicationService.sendMessage(siteDID, {
            operation: operation,
            ssi: ssi,
            tpDid: this.model.tp.did,
            shortDescription: shortMessage,
        });
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