const {WebcController} = WebCardinal.controllers;

export default class ViewStudyDetailsController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState;
        
    }
}
