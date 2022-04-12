const CommunicationService = require("common-services").CommunicationService;
import PremService from "../../../services/iot/PremService.js";
import ResponsesService from "../../../services/iot/ResponsesService.js";

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

export default class PremController extends WebcIonicController {
    constructor(...props) {
        super(...props);

        this.setModel(getInitModel());

        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();
        this.PremService = new PremService();
        this.ResponsesService = new ResponsesService();

        this.updatePrem();
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

    updatePrem() {
        this.PremService.getPrems((err, questionnaire) => {
            if (err) {
                return console.log(err);
            }
            this.model.questions = questionnaire
                .map((prem, i) => {
                    let templateType = 'question-' + prem.type + '-template';
                    
                    let questionModel = {

                        uid: prem.uid,
                        type: prem.type,

                        title: prem.question,
                        template: QUESTIONNAIRE_TEMPLATE_PREFIX + templateType,
                    }

                    if (prem.type === "range") {
                        questionModel['range'] = prem.range;
                    } else {
                        questionModel['options'] = prem.options;
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

            console.log(this.model.questions);

            
            const questionResponse = this.model.questions.map((question) => {


                return {

                    text: question.title,
                    responseDate: new Date().getTime(),





                    answers: [{"questionId":question.uid,"responseValue":question.type === "range"? question.range.value : question.value}]
                   
                   
                   
                }
            });


            this.ResponsesService.saveResponse(questionResponse, (err, data) => {
                if (err) {
                    return console.log(err);
                }

                console.log(data);
                //TODO
                //this.sendMessageToProfessional('questionnaire-response', data.uid);
            });
        });

        this.onTagClick('finish-questionnaire', (event) => {
            this.navigateToPageTag('home');
        });

        this.onTagClick('navigation:go-back', () => {
            this.history.goBack();
        });
    }

    sendMessageToProfessional(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.IOT.PROFESSIONAL_IDENTITY, {
            operation: operation,
            ssi: ssi
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
