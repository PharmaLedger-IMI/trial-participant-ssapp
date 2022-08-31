const CommunicationService = require("common-services").CommunicationService;
const commonServices = require('common-services');
const {QuestionnaireService, ResponsesService} = commonServices;
const {WebcIonicController} = WebCardinal.controllers;
const QUESTIONNAIRE_TEMPLATE_PREFIX = "iot/questionnaire/";
const Constants = commonServices.Constants;
import {getTPService}  from "../../../services/TPService.js"


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

export default class eDiaryController extends WebcIonicController {
    constructor(...props) {
        super(...props);

        this.model = {
            ...getInitModel()
        };

        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.ResponsesService = new ResponsesService();
        this.QuestionnaireService = new QuestionnaireService();

        this.prevState = this.getState();
        this.model.title = this.prevState.title;

        this.TPService = getTPService();
        this.TPService.getTp((err, tp) => {
            if (err) {
                return console.log(err);
            }
            this.model.patientDID = tp.did;
        })

        this.getResponses();
        this._attachHandlers();

        this.model.onChange("questionIndex",()=>{
            const currentIndex = this.model.questionIndex;
            this.model.questionNumber = currentIndex + 1;
            this.model.questions.forEach(question=>{
                question.visible = false
            })
            this.model.questions[currentIndex].visible = true;
            this.fillProgress();
            this.computeButtonStates();

        })
    }

    onReady(){
        this.progressElement = this.querySelector("#questionnaire_progress .progress-bar");
        this.fillProgress();
        this.computeButtonStates();
    }

    getResponses() {
        this.ResponsesService.getResponses((err, responses) => {
            if (err) {
                return console.log(err);
            }

            this.responsesOfCurrentType = responses.find(response => {
                if(response.questionResponses[0].question.task !== this.prevState.type) {
                    return false;
                }
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                let responseDate = new Date(response.questionResponses[0].responseDate);
                responseDate.setHours(0, 0, 0, 0);
                return date.getTime() === responseDate.getTime();
            })

            this.loadEdiary(this.prevState.type);

        });
    }

    loadEdiary(ediaryType) {

        this.QuestionnaireService.getAllQuestionnaires((err, data) => {
            if (err) {
                return reject(err);
            }
            this.model.questionnaire = data[0];
            this.model.siteDID = this.model.questionnaire.siteDID;

            this.model.questions = this.model.questionnaire[ediaryType]
                .map((q, i) => {

                    let questionResponse;
                    if(this.responsesOfCurrentType) {
                        questionResponse = this.responsesOfCurrentType.questionResponses.find(response => response.question.uid === q.uid);
                    }

                    // Cast to these types
                    // tempo fix change the model of questionnaire in clinical site //
                    if (q.type==="checkbox") {
                        q.options.forEach(option => option['value'] = option['optionValue'])
                        q.options.forEach(option => delete option.optionValue)
                    }
                    if (q.type==="free text") q.type="string";
                    // tempo fix change the model of questionnaire in clinical site //

                    let templateType = 'question-' + q.type + '-template';

                    let questionModel = {

                        uid: q.uid,
                        type: q.type,
                        task: ediaryType,
                        title: q.question,
                        template: QUESTIONNAIRE_TEMPLATE_PREFIX + templateType,
                    }

                    if (q.type === "slider") {
                        questionModel['slider']=
                            {   "min": q.minLabel,
                                "value": q.minLabel,
                                "steps": q.steps,
                                "max": q.maxLabel,
                                "minLabel": q.minLabel,
                                "maxLabel": q.maxLabel
                            };
                        if(questionResponse !== undefined) {
                            Object.assign(questionModel['slider'], {
                                "value": questionResponse.answer
                            })
                        }
                    }
                    else {
                        questionModel['options'] = q.options;
                        questionModel.value = "";
                        if(questionResponse !== undefined) {
                            questionModel.value = questionResponse.answer;
                        }

                        this.model.onChange("questions." + i, (changeDetails) => {
                        });
                    }

                    return questionModel;
                })
            this.model.questions[this.model.questionIndex].visible = true;
            if(this.progressElement) {
                this.fillProgress();
                this.computeButtonStates();
            }
        })

    }

    _attachHandlers() {
        this.onTagClick('prev', (event) => {
            let currentIndexSelected = this.model.questionIndex;
            if (currentIndexSelected > 0) {
                this.model.questionIndex = currentIndexSelected - 1;
            }

        });

        this.onTagClick('next', (event) => {
            let currentIndexSelected = this.model.questionIndex;
            if (currentIndexSelected < this.model.questions.length) {
                this.model.questionIndex = currentIndexSelected + 1;
            }

        });

        this.onTagClick('send-feedback', (event) => {
            this.model.fillMode = false;

            const questionResponses = this.model.questions.map((question) => {
                return {
                    question: question,
                    responseDate: new Date().getTime(),
                    patientDID: this.model.patientDID,
                    answer: question.type === "slider"? question.slider.value : question.value
                }
            });

            let wrappedResponses = {
                questionResponses: questionResponses,
            }

            if(this.responsesOfCurrentType) {
                wrappedResponses.uid = this.responsesOfCurrentType.uid;
            }

            this.ResponsesService.saveResponse(wrappedResponses, (err, data) => {
                if (err) {
                    return console.log(err);
                }

                if(this.responsesOfCurrentType === undefined) {
                    this.sendMessageToClinicalSite(this.model.siteDID, Constants.MESSAGES.PATIENT.QUESTIONNAIRE_RESPONSE, data, "");
                }
            });
        });

        this.onTagClick('finish-questionnaire', (event) => {
            const { month,day,year,today,visits, ...infos } = this.prevState;
            this.navigateToPageTag('econsent-tasks', {month, day, year, today, visits});
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
