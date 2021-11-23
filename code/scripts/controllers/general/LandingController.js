const {WebcController} = WebCardinal.controllers;
const usecases = WebCardinal.USECASES;

export default class LandingController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = JSON.parse(JSON.stringify(usecases));
    }

}
