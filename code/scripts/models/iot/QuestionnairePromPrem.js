export default {
    prom: [
        {
            question: "MOBILITY",
            type: "radio",
            options: [
                {
                    "value": "I have no problems in walking about"
                },

                {
                    "value": "I have slight problems in walking about"
                },

                {
                    "value": "I have moderate  problems in walking about"
                },

                {
                    "value": "I have severe problems in walking about"
                },
                {
                    "value": "I am unable to walk about"
                }
            ],
            uid: "q1"
        },
        {
            question: "SELF-CARE",
            type: "radio",
            options: [
                {
                    "value": "I have no problems whashing or dressing myself"
                },
                {
                    "value": "I have slight problems whashing or dressing myself"
                },
                {
                    "value": "I have moderate problems whashing or dressing myself"
                },
                {
                    "value": "I have severe problems whashing or dressing myself"
                },
                {
                    "value": "I am unable to whash or dress myself"
                }

            ],
            uid: "q2"
        },
        {
            question: "USUAL ACTIVITIES",
            type: "radio",
            options: [
                {
                    "value": "I have no problems doing my usual activities"
                },
                {
                    "value": "I have slight problems doing my usual activities"
                },
                {
                    "value": "I have moderate problems doing my usual activities"
                },
                {
                    "value": "I have severe problems doing my usual activities"

                },
                {
                    "value": "I am unable to do my usual activities"
                }


            ],
            uid: "q3"
        },
        {
            question: "PAIN / DISCOMFORT",
            type: "radio",
            options: [
                {
                    "value": "I have no pain or discomfort"
                },
                {
                    "value": "I have slight pain or discomfort"
                },
                {
                    "value": "I have moderate pain or discomfort"
                },
                {
                    "value": "I have severe pain or discomfort"
                },
                {
                    "value": "I have extreme pain or discomfort"
                }
            ],


            uid: "q4"
        },
        {
            question: "ANXIENTY / DEPRESSION",
            type: "radio",
            options: [
                {
                    "value": "I am not anxios or depressed"
                },
                {
                    "value": "I am slightly anxios or depressed"
                },
                {
                    "value": "I am moderately anxios or depressed"
                },
                {
                    "value": "I am severely anxios or depressed"
                },
                {
                    "value": "I am extremely anxios or depressed"

                }
            ],
            uid: "q5"
        },
        {
            question: "Indicate how your health is TODAY",
            type: "range",
            uid: "q6",
            // minLabel:"The worst health you can imagine",
            // maxLabel:"The best health you can imagine",
            // min:"0",
            // value:"5",
            //  max:"10",
            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "The worst health you can imagine",
                "maxLabel": "The best health you can imagine"

            }


        }

    ],
    prem: [
        {
            question: "Do you feel your care plan covers everything that needs to be covered?",
            type: "radio",
            options: [
                {
                    "value": "All aspects of care were covered"
                },

                {
                    "value": "Most, but not all aspects of care were covered"
                },

                {
                    "value": "Some aspects of care were covered"
                },

                {

                    "value": "Very few or no aspects of care were covered"
                }

            ],
            uid: "q1"
        },
        {
            question: "Did you feel you were treated with respect and dignity by healthcare professionals?",
            type: "radio",
            options: [
                {
                    "value": "Yes, always "
                },
                {
                    "value": "Yes, sometimes"
                },
                {
                    "value": "No"
                }

            ],
            uid: "q2"
        },
        {
            question: "Were you involved, as much as you wanted to be, in decisions about your care and treatment?",
            type: "radio",
            options: [
                {
                    "value": "Yes, definitely"
                },
                {
                    "value": "No"
                },
                {
                    "value": "I wasn’t well enough"
                },
                {
                    "value": "I didn’t want or need to be involved"

                }


            ],
            uid: "q3"
        },


        {
            question: "How annoying was to keep the patch applied to the chest?",
            type: "range",
            uid: "q4",

            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "No hassle",
                "maxLabel": "Maximun annoyance"

            }
        },
        {
            question: "How difficult was it to send data daily to the Virtual Clinic?",
            type: "range",
            uid: "q5",
            // minLabel:"The worst health you can imagine",
            // maxLabel:"The best health you can imagine",
            // min:"0",
            // value:"5",
            //  max:"10",
            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "No at all difficult",
                "maxLabel": "Maximum difficulty"

            }
        },
        {
            question: "How hard was it to contact the Virtual Clinic nurse?",
            type: "range",
            uid: "q6",

            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "No at all difficult",
                "maxLabel": "Maximum difficulty"

            }
        },
        {
            question: "How helpful was the Virtual Clinic nurse’s support when you contacted him?",
            type: "range",
            uid: "q7",

            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "No at all usefull",
                "maxLabel": "Very usefull"

            }
        },
        {
            question: "How much security did the remote monitoring system give you?",
            type: "range",
            uid: "q8",

            range: {
                "min": "0",
                "value": "5",
                "max": "10",
                "minLabel": "No security",
                "maxLabel": "A lot of security"

            }
        }
    ]


}

        
   


