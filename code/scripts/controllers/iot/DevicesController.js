const {WebcController} = WebCardinal.controllers;

export default class DevicesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.attachHandlers();
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
