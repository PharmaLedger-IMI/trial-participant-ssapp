const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const Constants = commonServices.Constants;

export default class HealthDataController extends WebcController {
    constructor(...props) {
        super(...props);
        this.state = this.getState() || {};
        this.model.healthData = [];
        this.model.hasHealthData = this.state.healthData.length > 0;

        this.labels = [];
        this.dataSets = [];
        let graphSections = [];
        let dataSet = [];
        this.model.healthStudyTitle = this.state.healthDataTitle;

        const generateRandomColor = () => {
            return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        }

        const populateTable = function (data) {
            for (let i = 0; i < data.length; i++) {
                let data1 = data[i];
                let fullDateTime1 = data1.effectiveDateTime;
                let dateTime1 = fullDateTime1.split("T");
                let time1 = dateTime1[1].split(".");
                this.labels.push((new Date(dateTime1[0])).toLocaleDateString(Constants.DATE_UTILS.DATE_LOCALE));

                this.model.healthData.push({
                    title: data1.code.text,
                    value: data1.valueQuantity.value,
                    unit: data1.valueQuantity.unit,
                    date: (new Date(dateTime1[0])).toLocaleDateString(Constants.DATE_UTILS.DATE_LOCALE),
                    time: time1[0]
                });
            }
        }

        if (this.state.healthDataTitle !== "All data types") {
            populateTable.bind(this)(this.state.healthData);
            for (let i = 0; i < this.state.healthData.length; i++) {
                dataSet.push(this.state.healthData[i].valueQuantity.value);
            }
            this.dataSets.push({
                label: this.model.healthStudyTitle,
                data: dataSet,
                backgroundColor: generateRandomColor(),
                borderColor: generateRandomColor(),
            });
        } else {
            let titlesSet = new Set();
            this.state.healthData.forEach(item => titlesSet.add(item.code.text));

            const normalize = function (val, max, min) {
                return (val - min) / (max - min);
            }

            for (const title of titlesSet.values()) {
                let filteredData = this.state.healthData.filter(random => random.code.text === title);
                populateTable.bind(this)(filteredData);
                let dataTypeValues = filteredData.map(z => z.valueQuantity.value);
                let min, max;
                let normalizedData = [];
                let map = new Map();
                min = Math.min(...dataTypeValues);
                max = Math.max(...dataTypeValues);
                for (let value of dataTypeValues) {
                    let result = normalize(value, max, min);
                    normalizedData.push(result);
                    map.set(result,value);
                }
                this.labels = filteredData.map(z => (new Date(z.effectiveDateTime)).toLocaleDateString(Constants.DATE_UTILS.DATE_LOCALE));

                graphSections.push({
                    title: title,
                    data: normalizedData,
                    mappedValues: map
                });
            }

            graphSections.forEach((section) => {
                this.dataSets.push({
                    label: section.title,
                    data: section.data,
                    backgroundColor: generateRandomColor(),
                    borderColor: generateRandomColor(),
                    mappedValues:section.mappedValues
                });
            });
        }

        let config = {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: this.dataSets
            },
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tootTipData => {
                                let map = tootTipData.dataset.mappedValues;
                                let returnedValue;
                                if(map !== undefined) {
                                    let data = tootTipData.dataset.data;
                                    let label = tootTipData.dataset.label;
                                    let index = tootTipData.dataIndex;
                                    for (const key of map.keys()) {
                                        if (key === data[index]) {
                                            returnedValue = `${label} : ${map.get(key)}`;
                                        }
                                    }
                                } else {
                                    let label = tootTipData.dataset.label;
                                    let value = tootTipData.formattedValue;
                                    returnedValue = `${label} : ${value}`;
                                }
                                return returnedValue;
                            }),
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            drawTicks : false
                        }
                    },
                }
            },
        }

        let timeSeriesElement = document.getElementById('timeSeriesChart').getContext('2d');
        new Chart(timeSeriesElement, config);

        this._attachHandlerGoBack();
    }

    _attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.navigateToPageTag('iot-data-selection');
        });
    }

}
