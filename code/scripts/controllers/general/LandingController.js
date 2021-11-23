const {WebcController} = WebCardinal.controllers;
const ecoServices = require('eco-services');
const DIDService = ecoServices.DIDService;
const usecases = WebCardinal.USECASES;

export default class LandingController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = JSON.parse(JSON.stringify(usecases));
        this.addHandlers();
        this.initServices();
    }

    addHandlers(){
        this.onTagEvent("navigate:econsent-home","click",()=>{
            this.navigateToPageTag('econsent-home');
        })
    }

    async initServices(){
        this.model.did = await DIDService.getDidAsync(this);
        this.CommunicationService = await DIDService.getCommunicationServiceInstanceAsync(this);
    }

}
