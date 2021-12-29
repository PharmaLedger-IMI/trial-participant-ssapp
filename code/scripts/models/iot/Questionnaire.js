export default {
    example: {
        "resourceType": "Questionnaire",
        "id": "bb",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"></div>"
        },
        "url": "http://hl7.org/fhir/Questionnaire/bb",
        "title": "NSW Government My Personal Health Record",
        "status": "draft",
        "subjectType": [
            "Patient"
        ],
        "date": "2013-02-19",
        "publisher": "New South Wales Department of Health",
        "jurisdiction": [
            {
                "coding": [
                    {
                        "system": "urn:iso:std:iso:3166",
                        "code": "AU"
                    }
                ]
            }
        ],
        "item": [
            {
                "linkId": "name",
                "text": "Enter your name:",
                "type": "string",
                "value":""
            },
            {
                "linkId": "birthWeight",
                "text": "Birth weight (kg)",
                "type": "decimal",
                "value":"0.00"
            },
            {
                "linkId": "birthday",
                "text": "Your birthday",
                "type": "dateTime",
                "value":"1980-01-01"
            },
            {
                "linkId": "annoying_patch",
                "text": "How annoying was it to keep the patch applied to the chest?",
                "type": "range",
                "range": {
                    "min":"0",
                    "value":"5",
                    "max":"10",
                    "minLabel":"No hassle",
                    "maxLabel":"Maximum annoyance"
                }
            },
            {
                "linkId": "difficult_send",
                "text": "How difficult was it to send data daily to the Virtual Clinic?",
                "type": "range",
                "range": {
                    "min":"0",
                    "value":"5",
                    "max":"10",
                    "minLabel":"Not at all difficult",
                    "maxLabel":"Maximum difficulty"
                }
            },
            {
                "linkId": "hard_contact",
                "text": "How hard was it to contact the Virtual Clinic nurse?",
                "type": "range",
                "range": {
                    "min":"0",
                    "value":"5",
                    "max":"10",
                    "minLabel":"Not at all difficult",
                    "maxLabel":"Maximum difficulty"
                }
            },
            {
                "linkId": "helpful_support",
                "text": "How helpful was the virtual clinic nurse's support when you contacted him?",
                "type": "range",
                "range": {
                    "min":"0",
                    "value":"5",
                    "max":"10",
                    "minLabel":"Not at all useful",
                    "maxLabel":"Very useful"
                }
            },
            {
                "linkId": "security_remote",
                "text": "How much security did the remote monitoring system give you?",
                "type": "range",
                "range": {
                    "min":"0",
                    "value":"5",
                    "max":"10",
                    "minLabel":"No security",
                    "maxLabel":"A lot of security"
                }
            }
        ]
    }
}
