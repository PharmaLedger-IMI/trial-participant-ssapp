const CommunicationService = require("common-services").CommunicationService;
const commonServices = require('common-services');
const {QuestionnaireService, ResponsesService} = commonServices;
import {getTPService}  from "../../../services/TPService.js"
const {WebcIonicController} = WebCardinal.controllers;
const QUESTIONNAIRE_TEMPLATE_PREFIX = "iot/questionnaire/";


const getInitModel = () => {
    return {
        progress:0,
        fillMode: true,
        questionIndex:0,
        questionNumber:1,
        questions: [],
        buttonsState: {
            showLeft: false,
            showRight: true,
            showFeedback: false
        }
    };
}

export default class PromController extends WebcIonicController {
    constructor(...props) {
        super(...props);

        this.setModel(getInitModel());

        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.ResponsesService = new ResponsesService();
        this.QuestionnaireService = new QuestionnaireService();

        this.TPService = getTPService();
        this.TPService.getTp((err, tp) => {
            if (err) {
                return console.log(err);
            }
            this.model.patientDID = tp.did;
        })

        this.updateProm();
        this._attachHandlers();

        this.model.onChange("questionIndex",()=>{
            const currentIndex = this.model.questionIndex;
            this.model.questionNumber = currentIndex + 1;
            this.model.questions.forEach(question=>{
                question.visible = false
            })
            this.model.questions[currentIndex].visible = true;
            this.fillProgress()
        })
    }

    onReady(){
        this.progressElement = this.querySelector("#questionnaire_progress .progress-bar");
    }

    updateProm() {

        this.QuestionnaireService.getAllQuestionnaires((err, data) => {
            if (err) {
                return reject(err);
            }
            this.model.questionnaire = data[0];
            this.model.siteDID = this.model.questionnaire.siteDID;

            this.model.questions = this.model.questionnaire.prom
                .map((prom, i) => {

                    // Cast to these types
                    // tempo fix change the model of questionnaire in clinical site //
                    if (prom.type==="slider") prom.type="range";
                    if (prom.type==="checkbox") {
                        prom.type="radio";
                        prom.options.forEach(option => option['value'] = option['element'])
                        prom.options.forEach(option => delete option.element)
                    }
                    if (prom.type==="free text") prom.type="string";
                    // tempo fix change the model of questionnaire in clinical site //

                    let templateType = 'question-' + prom.type + '-template';

                    let questionModel = {

                        uid: prom.uid,
                        type: prom.type,
                        task: "prom",
                        title: prom.question,
                        template: QUESTIONNAIRE_TEMPLATE_PREFIX + templateType,
                    }

                    if (prom.type === "range") {
                        questionModel['range']=
                            {   "min": prom.minLabel,
                                "value": prom.minLabel,
                                "steps": prom.steps,
                                "max": prom.maxLabel,
                                "minLabel": prom.minLabel,
                                "maxLabel": prom.maxLabel};
                    }
                    else {
                        questionModel['options'] = prom.options;
                        questionModel.value = "";

                        this.model.onChange("questions." + i, (changeDetails) => {
                        });
                    }

                    return questionModel;
                })
            this.model.questions[this.model.questionIndex].visible = true;
            this.fillProgress();
        })

    }

    _attachHandlers() {
        this.onTagClick('prev', (event) => {
            let currentIndexSelected = this.model.questionIndex;
            if (currentIndexSelected > 0) {
                this.model.questionIndex = currentIndexSelected - 1;
            }
            this.computeButtonStates();

        });

        this.onTagClick('next', (event) => {
            let currentIndexSelected = this.model.questionIndex;
            if (currentIndexSelected < this.model.questions.length) {
                this.model.questionIndex = currentIndexSelected + 1;
            }
            this.computeButtonStates();

        });

        this.onTagClick('send-feedback', (event) => {
            this.model.fillMode = false;

            const questionResponse = this.model.questions.map((question) => {
                return {
                    question: question,
                    responseDate: new Date().getTime(),
                    patientDID: this.model.patientDID,
                    answer: question.type === "range"? question.range.value : question.value
                }
            });

            this.ResponsesService.saveResponse(questionResponse, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
                this.sendMessageToClinicalSite(this.model.siteDID, "questionnaire-responses", data.sReadSSI, "")
            });
        });

        this.onTagClick('finish-questionnaire', (event) => {
            this.navigateToPageTag('home');
        });

        this.onTagClick('navigation:go-back', () => {
            this.history.goBack();
        });
    }

    sendMessageToClinicalSite(siteDID, operation, ssi, shortMessage) {
        this.CommunicationService.sendMessage(siteDID, {
            operation: operation,
            ssi: ssi,
            shortDescription: shortMessage,
        });
    }

    computeButtonStates() {
        this.model.buttonsState.showLeft = this.model.questionIndex > 0;
        this.model.buttonsState.showRight = this.model.questionIndex < this.model.questions.length - 1;
        this.model.buttonsState.showFeedback = this.model.questionIndex === this.model.questions.length - 1
    }

    fillProgress(){
        this.model.progress = Math.ceil(100 * this.model.questionNumber/this.model.questions.length)+"%";
        this.progressElement.style.width = this.model.progress;
    }


}
