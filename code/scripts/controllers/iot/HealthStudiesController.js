import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;

export default class HealthStudiesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();

        this.onTagClick("participating-studies",()=>{
            this.navigateToPageTag("participating-studies");
        });

        this.onTagClick("pending-invitations",()=>{
            this.navigateToPageTag("pending-invitations");
        });

        this.onTagClick("completed-studies",()=>{
            this.navigateToPageTag("completed-studies");
        });

    }

    async initServices() {
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })
    }
}
