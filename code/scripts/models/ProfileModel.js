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
        this.profile = JSON.parse(JSON.stringify(profileModel))
    }

    setProfileModel(profileData){
        Object.keys(profileData).forEach((key)=>{
            if(this.profile[key]){
                this.profile[key].value = profileData[key];
            }
        })
    }

    getProfileModel(){
        return this.profile;
    }
}
