import EvidenceService from "../../services/EvidenceService.js";
const commonServices = require("common-services");
const DataSourceFactory = commonServices.getDataSourceFactory();

const {WebcController} = WebCardinal.controllers;

export default class EvidencesListController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();

        this._attachHandlerBack();
    }

    async initServices() {
        this.EvidenceService= new EvidenceService();

        const getEvidences = () => {
            return new Promise ((resolve, reject) => {
                this.EvidenceService.getEvidences((err, evidences) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(evidences)
                })
            })
        }

        getEvidences().then(data => {
            let evidences = data;
            this.model.hasEvidences = evidences.length !== 0;
            this.model.evidencesDataSource = DataSourceFactory.createDataSource(8, 5, evidences);
            this.onTagClick("view-evidence", (model) => {
                let evidenceState = {
                    studyID: model.studyID,
                    evidenceID: model.uid,
                }
                this.navigateToPageTag('view-evidence' ,evidenceState);
            });
        })
    }

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('completed-studies');
        });
    }
}
