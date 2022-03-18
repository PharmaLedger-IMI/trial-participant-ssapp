import EDiaryService from "../../../services/iot/EDiaryService.js";
const commonServices = require("common-services");
const { WebcController } = WebCardinal.controllers;

const initModel = {
    isFormInvalid: true,
    isUsed: {
        checked: false
    },
    isDetached: {
        checked: true
    },
    date: {
       label: "Please indicate the date of the activity",
       name: "date",
       required: true,
       value: commonServices.DateTimeService.convertDateToInputValue(new Date())
    },
    devices: {
        label: "Please select your device",
        required: true,
        options:[{
            label:"Device 1",
            value: 'Device 1'
        },
        {
            label:"Device 2",
            value: 'Device 2'
        },
        {
            label:"Device 3",
            value: 'Device 3'
        }
    ],
    value: ""
    },
    notes: {
        label: "Notes",
        name: "notes",
        required: true,
        placeholder: "Insert your note here",
        value: ""
    }
}

export default class CreateEdiaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.setModel(JSON.parse(JSON.stringify(initModel)));
        console.log(this.model);
        this.EDiaryService = new EDiaryService();
        this._addHandlerBack();
        this._attachHandlerEDiaryCreate();
    }

    _attachHandlerEDiaryCreate() {

        this.model.onChange("notes.value", () => {
            let notes = this.model.notes.value;
            this.model.isFormInvalid = notes.trim() === "";
        });
        
        this.onTagClick('ediary:create', (event) => {
            let ediaryRecord = {
                isUsed: this.model.isUsed,
                isDetached: this.model.isDetached,
                date: new Date(this.model.date.value).getTime(),
                notes: this.model.notes.value,
                device: this.model.devices.value
            }

            this.EDiaryService.saveEdiary(ediaryRecord, (err, data) => {
                if (err) {
                    return console.log(err);
                }

                this.navigateToPageTag("thk-ediary");
            });
        });

    }
    _addHandlerBack() {

        this.onTagClick('ediary:back', () => {
            this.navigateToPageTag('iot-ediary');

        });

    }
}