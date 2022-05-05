WebCardinal.USECASES = {
    econsent: true,
    iot: true
}

const {addControllers, addHook} = WebCardinal.preload;

function defineWebCardinalComponents() {
    const {define} = WebCardinal.components;

    define('pl-calendar');
}

addHook('beforeAppLoads', async () => {
    try {
        defineWebCardinalComponents();
        const {CalendarController} = await import("../components/pl-calendar/CalendarController.js");
        addControllers({CalendarController});

    } catch (error) {
        console.error('Error while defining WebCardinal components', error);
    }
});

addHook('beforeAppLoads', async () => {
    try {
        defineWebCardinalComponents();

        await import("../components/share-did/share-did.js");

    } catch (error) {
        console.error('Error while defining WebCardinal components', error);
    }
});