const profileModel = {
    name: {
        type: 'text',
        value: '',
        placeholder: 'Please enter your name'
    },
    age: {
        type: 'number',
        value: '',
        placeholder: 'Please enter your age'
    },
    email: {
        type: 'email',
        value: '',
        placeholder: 'Please enter your email'
    }
}

export default class ProfileModel {

    constructor() {
        this = JSON.parse(JSON.stringify(profileModel))
    }

    setProfileModel(profileData){
        this = {
            ...this, ...profileData
        }
    }
}
