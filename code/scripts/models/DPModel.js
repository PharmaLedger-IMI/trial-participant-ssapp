const dpModel = {
    name: {type: 'text', value: "Emma McKney"},
    contactMe: {type: 'boolean', value: false},
    perm: {
        wantToShare: {type: 'boolean', value: false},
        givePermisionEachTime: {type: 'boolean', value: false},
        shareWithHospitals: {type: 'checkbox', value: false},
        shareWithPharmas: {type: 'checkbox', value: false},
        shareWithResearchers: {type: 'checkbox', value: false},
        areaToParticipateCancer: {type: 'checkbox', value: false},
        areaToParticipateDiabets: {type: 'checkbox', value: false},
        areaToParticipateCOPD: {type: 'checkbox', value: false}
    }
}

export default class DPModel {

    constructor() {
        this.dp = JSON.parse(JSON.stringify(dpModel))
    }

    setDPModel(dpData) {
        Object.keys(dpData).forEach((key) => {
            if (this.dp[key] && this.dp[key] !== 'perm') {
                this.dp[key].value = dpData[key];
            }
        })
        if (dpData.hasOwnProperty('perm')) {
            Object.keys(dpData.perm).forEach((key) => {
                this.dp.perm[key].value = dpData.perm[key];
            })
        }
    }

    getDPModel() {
        return this.dp;
    }
}