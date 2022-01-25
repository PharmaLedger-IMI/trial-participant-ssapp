const { WebcController } = WebCardinal.controllers;

export default class ThkEDiaryController extends WebcController {
    constructor(...props) {
        super(...props);
        //const currentState = history.state;
        // Should be null because we haven't modified the history stack yet
//console.log(`History.state before pushState: ${history.state}`);

// Now push something on the stack
//history.pushState({name: 'Example'}, "pushState example", 'page3.html');

// Now state has a value.
//console.log('History.state after pushState: ', history.state);

        this.addHandlers();
    }


    addHandlers() {

        this.onTagClick('iot-ediary', () => {
            this.navigateToPageTag('iot-ediary');

        });

    }
}