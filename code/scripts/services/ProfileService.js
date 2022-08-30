const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

class ProfileService extends DSUService {

    constructor() {
        super('/profile');
        this.profilePicture = "./assets/images/profile-pic.jpg"
        this.hasProfilePicture = false
    }

    getContactData(callback){
        this.getEntities((err, contactData)=>{
            if(err){
                return callback(err);
            }
            callback(undefined, contactData[0]);
        });
    }

    saveContactData(contactData, callback) {
        if (contactData.uid) {
            return this.updateEntity(contactData, (err, saveProfileData) => {
                if (err) {
                    return callback(err);
                }
                this.getMountedSSI(saveProfileData.uid, (err, saveProfileDataIdentifier) => {
                    if (err) {
                        return callback(err);
                    }
                    const profilesReadSSI = this.getSReadSSI(saveProfileDataIdentifier);
                    callback(undefined, profilesReadSSI);
                })

            });
        }
        this.saveEntity(contactData, (err, saveProfileData) => {
            if (err) {
                return callback(err);
            }
            callback(undefined, saveProfileData.sReadSSI);
        });
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