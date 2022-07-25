import ConsentStatusMapper from '../../utils/ConsentStatusMapper.js';
import TrialConsentService from "../../services/TrialConsentService.js";

const commonServices = require('common-services');
const BaseRepository = commonServices.BaseRepository;
const CommunicationService = commonServices.CommunicationService;
const FileDownloaderService = commonServices.FileDownloaderService;
const Constants = commonServices.Constants;
import {getTPService} from "../../services/TPService.js";

const {WebcController} = WebCardinal.controllers;

export default class ConsentPreviewController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model.econsent = {};
        this._initServices();
        this.model.historyData = this.history.win.history.state.state;
        this.model.required = {};
        this.model.declined = {};
        this.model.signed = {};
        this.model.withdraw = {};
        this.model.showControls = false;
        this.model.pdf = {
            currentPage: 1,
            pagesNo: 0
        }
        this._initHandlers();
    }

    async _initServices() {
        this.TPService = getTPService();
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.EconsentsStatusRepository = BaseRepository.getInstance(BaseRepository.identities.PATIENT.ECOSESENT_STATUSES);
        this.TrialConsentService = new TrialConsentService();
        this.TrialConsentService.getOrCreate((err, trialConsent) => {
            if (err) {
                return console.log(err);
            }
            this.model.trialConsent = trialConsent;
            this._initConsent();
        });
    }

    _initConsent() {
        let econsent = this.model.trialConsent.volatile.ifc.find(c => c.uid === this.model.historyData.consentUid)
        let ecoVersion = this.model.historyData.versionId;
        this.model.econsent = econsent;
        this.currentVersion = econsent.versions.find(eco => eco.version === ecoVersion);
        let econsentFilePath = this.getEconsentFilePath(econsent, this.currentVersion);
        this.fileDownloaderService = new FileDownloaderService(this.DSUStorage);
        this._downloadFile(econsentFilePath, this.currentVersion.attachment);
        this.EconsentsStatusRepository.findAll((err, data) => {
            if (err) {
                return console.error(err);
            }
            let relevantStatuses = data.filter((element) => element.foreignConsentId === this.model.historyData.ecoId);
            let currentStatus = relevantStatuses.length > 0 ? relevantStatuses[relevantStatuses.length - 1] : {actions: []}
            this.model.status = currentStatus;
            this.model.signed = ConsentStatusMapper.isSigned(this.model.status.actions);
            this.model.declined = ConsentStatusMapper.isDeclined(this.model.status.actions);
            this.model.required = ConsentStatusMapper.isRequired(this.model.status.actions);
            this.model.withdraw = ConsentStatusMapper.isWithdraw(this.model.status.actions);
            this.model.withdrawIntention = ConsentStatusMapper.isWithdrawIntention(this.model.status.actions);
        });
    }

    _initHandlers() {
        this._attachHandlerBack();
    }

    _finishProcess(event, response) {
        event.stopImmediatePropagation();
        this.responseCallback(undefined, response);
    }

    getEconsentFilePath(econsent, currentVersion) {
        return this.TrialConsentService.PATH  + '/' + this.model.trialConsent.uid + '/ifc/'
            + econsent.uid + '/versions/' + currentVersion.version;
    }

    sendMessageToHCO(action, ssi, shortMessage) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate());

        this.TPService.getTp((err, tp)=>{
            if(err){
                return console.log(err);
            }

            this.model.tp = tp;
            let sendObject = {
                operation: Constants.MESSAGES.HCO.UPDATE_ECOSENT,
                ssi: ssi,
                useCaseSpecifics: {
                    trialSSI: this.model.historyData.trialuid,
                    tpNumber: this.model.tp.number,
                    tpDid: this.model.tp.did,
                    version: this.model.historyData.ecoVersion,
                    siteSSI: this.model.tp.site?.keySSI,
                    action: {
                        name: action,
                        date: currentDate.toISOString(),
                        toShowDate: currentDate.toLocaleDateString(),
                    },
                },
                shortDescription: shortMessage,
            };
            this.CommunicationService.sendMessage(this.model.tp.hcoIdentity, sendObject);
        });
    }

    _downloadFile = async (filePath, fileName) => {
        await this.fileDownloaderService.prepareDownloadFromDsu(filePath, fileName);
        let fileBlob = this.fileDownloaderService.getFileBlob(fileName);
        this.rawBlob = fileBlob.rawBlob;
        this.mimeType = fileBlob.mimeType;
        this.blob = new Blob([this.rawBlob], {
            type: this.mimeType,
        });
        this._displayFile();
    };

    _loadPdfOrTextFile = () => {
        const reader = new FileReader();
        reader.readAsDataURL(this.blob);
        reader.onloadend = () => {
            let base64data = reader.result;
            this.initPDF(base64data.substr(base64data.indexOf(',') + 1));
        };
    };

    initPDF(pdfData) {
        pdfData = atob(pdfData);
        let pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'scripts/third-parties/pdf.worker.js';

        this.loadingTask = pdfjsLib.getDocument({data: pdfData});
        this.renderPage(this.model.pdf.currentPage);
        window.addEventListener("scroll", (event) => {
            let myDiv = event.target;
            if (myDiv.id === 'canvas-wrapper'
                && myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight - 1) {
                this.model.showControls = true;
            }
        }, {capture: true});
    }

    renderPage = (pageNo) => {
        this.loadingTask.promise.then((pdf) => {
            this.model.pdf.pagesNo = pdf.numPages;
            if (pdf.numPages <= 1) {
                this.model.showControls = true;
            }
            pdf.getPage(pageNo).then(result => this.handlePages(pdf, result));
        }, (reason) => console.error(reason));
    }

    handlePages = (thePDF, page) => {
        const viewport = page.getViewport({scale: 0.64});
        let canvas = document.createElement("canvas");
        canvas.style.display = "block";
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({canvasContext: context, viewport: viewport});
        document.getElementById('canvas-parent').appendChild(canvas);

        this.model.pdf.currentPage = this.model.pdf.currentPage + 1;
        let currPage = this.model.pdf.currentPage;
        if (thePDF !== null && currPage <= this.model.pdf.pagesNo) {
            thePDF.getPage(currPage).then(result => this.handlePages(thePDF, result));
        }
    }

    _displayFile = () => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const file = new File([this.rawBlob], this.fileName);
            window.navigator.msSaveOrOpenBlob(file);
            this.feedbackController.setLoadingState(true);
            return;
        }

        window.URL = window.URL || window.webkitURL;
        const fileType = this.mimeType.split('/')[0];
        switch (fileType) {
            case 'image': {
                this._loadImageFile();
                break;
            }
            default: {
                this._loadPdfOrTextFile();
                break;
            }
        }
    };

    _attachHandlerBack() {
        this.onTagClick('navigation:go-back', (model) => {
            this.navigateToPageTag('site-consent-history');
        });
    }
}
