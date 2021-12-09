import ProfileModel from '../../models/ProfileModel.js';
import ProfileService from '../../services/ProfileService.js';

const { WebcController } = WebCardinal.controllers;

export default class MyProfileController extends WebcController {
  constructor(...props) {
    super(...props);
    this.profileModel = new ProfileModel();
    this.profileService = new ProfileService();
    this.profileService.getProfile((err, profileData)=>{
      if (err) {
        console.log(err)
        return
      }
      if (profileData) {
        this.profileModel.setProfileModel(profileData)
      }
      this.model = {
        profile:{
          ...this.profileModel
        }
      }
    })
    addEventListeners();
  }

  addEventListeners() {
    this.onTagClick('profile:save', ()=> {
      console.log(this.model)
    })
  }

  
}
