const { WebcController } = WebCardinal.controllers;

export default class CompletedStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.studies = [
            {
                value: 'Medication from Oviedo Hospital'
            },
            {
                value: 'Vital signals at La Paz Hospital'
            },
            {
                value: 'All records with Monte Sinai'
            }
        ];

       this.btnHandlers();
    }

    btnHandlers() {
        this.onTagClick('navigate:view-study', (model) => {
            this.navigateToPageTag('');
        })

        this.onTagClick('navigate:evidence', (model) => {
            this.navigateToPageTag('evidences-list')
        })

        this.onTagClick("navigate:feedback", () => {
            this.navigateToPageTag('iot-feedback');
        });

        this.onTagClick('navigate:permissions', (model) => {
            this.navigateToPageTag('')
        })

        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('iot-health-studies');
        });
    }
}
