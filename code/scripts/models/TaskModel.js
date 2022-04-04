export default {
    example: {
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
                "task": "Prom",
                "schedule": [
                    {
                        "start-date": "2022-05-01",
                        "end-date": "2022-08-01",
                        "repeat-appointment": "weekly"
                    }
                ]
            },
            {
                "task": "Prem",
                "schedule": [
                    {
                        "start-date": "2022-05-02",
                        "end-date": "2022-08-02",
                        "repeat-appointment": "weekly"
                    }
                ]
            },
            {
                "task": "Call",
                "schedule": [
                    {
                        "start-date": "2022-05-01",
                        "end-date": "2022-08-01",
                        "repeat-appointment": "daily"
                    }
                ]
            },
            {
                "task": "Visit",
                "schedule": [
                    {
                        "start-date": "2022-05-10",
                        "end-date": "2022-08-10",
                        "repeat-appointment": "monthly"
                    }
                ]
            }
        ]
    }
}