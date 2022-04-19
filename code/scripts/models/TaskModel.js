function getTestTaskModel() {
    return {
        "resourceType": "Tasks",
        "id": "bb",
        "text": {
            "status": "generated",
            "div": ""
        },
        "url": "",
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
                "task": "Weekly",
                "tag": "navigate:ediary-prom",
                "schedule": {
                            "startDate": "2022-04-1",
                            "endDate": "2022-08-01",
                            "repeatAppointment": "weekly"
                            },
                "showTask": ""
            },
            {
                "task": "Monthly",
                "tag": "navigate:ediary-prem",
                "schedule": {
                    "startDate": "2022-04-1",
                    "endDate": "2022-08-01",
                    "repeatAppointment": "monthly"
                },
                "showTask": ""
            },
            {
                "task": "Daily",
                "tag": "navigate:ediary-prom",
                "schedule": {
                    "startDate": "2022-04-1",
                    "endDate": "2022-08-01",
                    "repeatAppointment": "daily"
                },
                "showTask": ""
            }
        ]
    }
}

export {getTestTaskModel}