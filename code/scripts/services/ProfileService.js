const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class ProfileService extends DSUService {

    constructor() {
        super('/profile');
    }

    getProfile(callback) {
        this.getEntities((err, profiles) => {
            if (err) {
                return callback(err)
            }
            let myProfile = profiles && profiles.length > 0 ? profiles[0] : undefined
            callback(err, myProfile)
        })
    }  

    saveProfile(profile, callback) {
        this.saveEntity(profile, callback);
    }

    updateProfile(profile, callback) {
        this.updateEntity(profile, callback);
    }

}