const { WebcController } = WebCardinal.controllers;

export default class ThkEDiaryController extends WebcController {
    constructor(...props) {
        super(...props);
        this.addHandlers();
    }

    addHandlers() {

        this.onTagClick('iot-ediary', () => {
            this.navigateToPageTag('iot-ediary');

        });

    }
}