const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

class ProfileService extends DSUService {

    constructor() {
        super('/profile');
        this.profilePicture = "./assets/images/profile-pic.jpg"
        this.hasProfilePicture = false
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

    deleteProfile(profile, callback) {
        console.log("delete profile WIP!")
    }

    saveProfilePicture(filedata, callback) {
        this.writeFile("/profile-pic", $$.Buffer.from(filedata), (err,data)=>{
            // this.hasProfilePicture = false
            this.profilePicture = filedata
            callback(err,data)
        })
    }

    getProfilePicture(callback) {
        if (this.hasProfilePicture) {
            return callback(undefined, this.profilePicture)
        }
        this.readFile("/profile-pic", (err,data)=>{
            if (!err && data) {
                this.profilePicture = data
            }
            this.hasProfilePicture = true      
            callback(undefined, this.profilePicture)
        })
    }
}

let instance = null

const getProfileService = ()=>{
    if (!instance) {
        instance = new ProfileService()
    }
    return instance
}

export default { getProfileService }
