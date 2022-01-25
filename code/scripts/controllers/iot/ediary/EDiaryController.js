import EDiaryService from "../../../services/iot/EDiaryService.js";

const { WebcController } = WebCardinal.controllers;


export default class EDiaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.setModel({
            ediaries: []
        });

        this.EDiaryService = new EDiaryService();
        
        this.EDiaryService.getEdiaries((err, data) => {
            if (err) {
                return console.log(err);
            }
            data.forEach(item => {
                item.stringDate = new Date(item.date).toLocaleDateString();
                console.log(item.stringDate);
            });
            this.model.ediaries = data;
            console.log(data);
        });

        this._attachHandlerEDiaryCreate();
        this._attachHandlerEDiaryView();
        this._attachHandlerEDiaryBack();

    }

    _attachHandlerEDiaryCreate (){
        this.onTagClick('ediary:create', (event) => {
            this.navigateToPageTag('create-diary');
        });
    }

    _attachHandlerEDiaryBack() {
        this.onTagClick('ediary:back', (event) => {
            this.navigateToPageTag('iot-devices');
        });
    }
    _attachHandlerEDiaryView() {
        
        this.onTagClick('ediary:view', (model) => {
            console.log(model);
            this.navigateToPageTag('view-ediary',{
                uid: model.KeySSI
            });
        });
    }


}
