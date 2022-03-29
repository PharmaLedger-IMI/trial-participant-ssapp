const { WebcController } = WebCardinal.controllers;

export default class ParticipatingStudiesController extends WebcController {
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

        this.onTagClick('view-study-details', (model) => {
            let studyState = {
                pageType: 'participating-study',
                title: model,
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
            }
            this.navigateToPageTag('view-study-details', studyState)
        })
    }
}
