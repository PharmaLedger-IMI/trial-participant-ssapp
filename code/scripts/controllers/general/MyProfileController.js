import ProfileModel from '../../models/ProfileModel.js';
import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;

export default class MyProfileController extends WebcController {
    constructor(...props) {
        super(...props);
        this.profileExists = false;
        this.profileModel = new ProfileModel();
        this.profileService = new ProfileService();
        this.profileService.getProfile((err, profileData) => {
            if (err) {
                return console.log(err);
            }
            if (profileData) {
                this.profileExists = true;
                this.profileData = profileData;
                this.profileModel.setProfileModel(profileData)
            }
            this.model = {
                profileExits: this.profileExists,
                profile: {
                    ...this.profileModel.getProfileModel()
                }
            }
        });
        this.model.profilePicture = "./assets/images/profile-pic.jpg"
        this.addTagsListeners();
        this.addProfilePictureHandler();
    }

    addTagsListeners() {

        this.onTagClick('profile:save', () => {
            let profile = this.model.profile;
            let profileData = {
                name: profile.name.value,
                age: profile.age.value,
                email: profile.email.value
            }

            let profileCreatedOrUpdatedHandler = (err, profile) => {
                if (err) {
                    return console.log(err);
                }

                this.navigateToPageTag("home");
            }

            if (!this.profileExists) {
                this.profileService.saveProfile(profileData, profileCreatedOrUpdatedHandler)
            } else {

                if (this.profileData) {
                    this.profileData = {...this.profileData, ...profileData}
                }
                this.profileService.updateProfile(this.profileData, profileCreatedOrUpdatedHandler)
            }
        })

        this.onTagClick('profile:delete', () => {
            let profile = this.model.profile;
            let profileData = {
                name: profile.name.value,
                age: profile.age.value,
                email: profile.email.value
            }
          
            let profileDeletedHandler = (err, profile) => {
                if (err) {
                    return console.log(err);
                }
             }

            if (this.profileExists) {
                this.profileService.deleteProfile(profileData, profileDeletedHandler)
                this.navigateToPageTag("home");
           }
        })

    }


    addProfilePictureHandler() {
        const profilePictureUpload = this.querySelector('#profileImageUpload')

        profilePictureUpload.addEventListener('change',(data)=>{

            let imageFile = data.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(imageFile);
        
            reader.onload = (evt)=>{
                this.model.profilePicture = evt.target.result
            }}) 
    }

}
