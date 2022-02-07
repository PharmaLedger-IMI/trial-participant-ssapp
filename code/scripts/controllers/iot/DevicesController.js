import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;

export default class DevicesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.attachHandlers();
        this.initServices();
    }

    async initServices() {
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })

    }

    attachHandlers(){
        this.onTagClick("navigate:iot-ediary",()=>{
            this.navigateToPageTag("iot-ediary");
        })
        this.onTagClick("navigate:iot-questionnaire",()=>{
            this.navigateToPageTag("iot-questionnaire");
        })
    }


}
