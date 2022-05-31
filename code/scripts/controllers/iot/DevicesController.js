import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;

export default class DevicesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.attachHandlers();
        this._attachHandlerBack();
        this.initServices();
    }

    async initServices() {
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('home');
        });
    }

    attachHandlers(){
        this.onTagClick("navigate:iot-ediary",()=>{
            this.navigateToPageTag("iot-ediary");
        })
        this.onTagClick("navigate:iot-questionnaire",()=>{
            this.navigateToPageTag("iot-questionnaire");
        })
        this.onTagClick("navigate:iot-data-selection",()=>{
            this.navigateToPageTag("iot-data-selection");
        })
    }


}
