
const {WebcController} = WebCardinal.controllers;

export default class TemporController extends WebcController {
    constructor(...props) {
        super(...props);
        this.attachHandlers();

    }

    attachHandlers(){
        this.onTagClick("navigate:ediary-prom",()=>{
            this.navigateToPageTag("ediary-prom");
        })
        this.onTagClick("navigate:ediary-prem",()=>{
            this.navigateToPageTag("ediary-prem");
        })
    }

}