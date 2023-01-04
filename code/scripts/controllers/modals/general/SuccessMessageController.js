const {WebcController} = WebCardinal.controllers;


export default class SuccessMessageController extends WebcController {
    constructor(...props) {
        super(...props);

        setTimeout(()=>{
            this.element.remove();
        },4000)
    }
}