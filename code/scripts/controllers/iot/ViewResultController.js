const commonServices = require('common-services');
const ResultsService = commonServices.ResultsService;
const {WebcController} = WebCardinal.controllers;
const FileDownloaderService = commonServices.FileDownloaderService;


export default class ViewResultController extends WebcController {
    constructor(...props) {
        super(...props);

        this.prevState = this.getState() || {};
        this.fileDownloaderService = new FileDownloaderService(this.DSUStorage);
        this.ResultsService = new ResultsService();
        this.ResultsService.getResult(this.prevState.resultID, (err, results) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getResultDetailsViewModel(results);
        });
        this._attachHandlerDownload()
        this._attachHandlerBackMenu();
    }

    getResultFilePath(uid) {
        return 'results' + '/' + uid+ '/files/';
    }

    _attachHandlerDownload() {
        this.onTagClick('download-file', async (model, target, event) => {
            if (this.model.filename) {
                let path = this.getResultFilePath(this.model.id);
                await this.fileDownloaderService.prepareDownloadFromDsu(path, this.model.filename);
                this.fileDownloaderService.downloadFileToDevice(this.model.filename);
            }
        });
    }

    _attachHandlerBackMenu() {
        this.onTagClick('navigation:go-back', (event) => {
            this.navigateToPageTag('results-list', {
                studyID: this.prevState.studyID,
                participatingCompletedFullStudies: this.prevState.participatingCompletedFullStudies
            });
        });
    }

    getResultDetailsViewModel(results) {
        return {
            id: results.uid,
            title: results.title,
            subtitle: results.subtitle,
            version: results.version,
            status: results.status,
            topics:  results.topics,
            exposureBackground: results.exposureBackground,
            description: results.description,
            attachedFile: {
                name: "file uploaded",
                label: "File Uploaded",
                placeholder: "File uploaded",
                button: results.filename ? "Download" : "Not uploaded"
            },
            filename: results.filename
        }
    }
}
