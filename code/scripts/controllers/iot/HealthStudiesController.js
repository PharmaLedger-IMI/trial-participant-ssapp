import ProfileService from '../../services/ProfileService.js';

const {WebcController} = WebCardinal.controllers;
const commonServices = require('common-services');
const {DPService, StudiesService} = commonServices;

export default class HealthStudiesController extends WebcController {
    constructor(...props) {
        super(...props);
        this.initServices();

        this._attachHandlers();
    }

    getPendingInvitations() {
        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this.invitationsStudiesUIDs = [];
        this.invitationsFullStudies = [];

        this.dpService.getDPs((err, DPs) => {
            if (err) {
                return console.log(err);
            }
            let DP = DPs && DPs.length > 0 ? DPs[0] : undefined
            if (DP) {
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true || match.dpermissionRejectedDate || match.dpermissionStopSharingDate) return;
                        this.invitationsStudiesUIDs.push(match.studyUID)
                    })
                    if (this.invitationsStudiesUIDs.length>0) {
                        console.log("Found %d invitations.", this.invitationsStudiesUIDs.length);
                    }

                    this.studiesService.getStudies((err, studies) => {
                        if (err){
                            return console.log(err);
                        }
                        this.invitationsStudiesUIDs.forEach( studyUID => {
                            studies.forEach(mountedStudy => {
                                if (mountedStudy.uid===studyUID){
                                    this.invitationsFullStudies.push(mountedStudy);
                                }
                            })
                        })
                        this.model.numberOfPendingInvitations = this.invitationsFullStudies.length;
                    });
                }
            }
        });

    }

    getAllParticipatingStudies() {
        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this.participatingStudiesUIDs = [];
        this.participatingFullStudies = [];

        const getParticipatingStudies = () => {
            return new Promise ((resolve, reject) => {
                this.dpService.getDPs((err, dPermission) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(dPermission)
                })
            })
        }

        getParticipatingStudies().then(data => {
            let DP = data && data.length > 0 ? data[0] : undefined
            if (DP){
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true) {
                            this.participatingStudiesUIDs.push(match.studyUID);
                        };
                    })
                    console.log("Found %d participating studies.", this.participatingStudiesUIDs.length);
                    this.studiesService.getStudies((err, studies) => {
                        if (err){
                            return console.log(err);
                        }
                        this.participatingStudiesUIDs.forEach( studyUID => {
                            studies.forEach(mountedStudy => {
                                if (mountedStudy.uid===studyUID && mountedStudy.status!=="completed"){
                                    this.has_participating_studies = true;
                                    this.participatingFullStudies.push(mountedStudy);
                                }
                            })
                        })
                        this.model.numberOfParticipatingStudies = this.participatingFullStudies.length;
                    });
                }
            }
        });
    }

    getAllCompletedStudies() {
        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();

        this.uidsParticipatingStudies = [];
        this.participatingCompletedFullStudies = [];

        const getParticipatingStudies = () => {
            return new Promise ((resolve, reject) => {
                this.dpService.getDPs((err, dPermission) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(dPermission)
                })
            })
        };

        getParticipatingStudies().then(data => {
            let DP = data && data.length > 0 ? data[0] : undefined
            if (DP){
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermission===true) {
                            this.uidsParticipatingStudies.push(match.studyUID);
                        };
                    })
                    console.log("Found %d participating studies.", this.uidsParticipatingStudies.length);

                    const getCompletedStudies = () => {
                        return new Promise ((resolve, reject) => {
                            this.studiesService.getStudies((err, allStudies) => {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(allStudies)
                            })
                        })
                    };

                    getCompletedStudies().then(studies => {
                        this.uidsParticipatingStudies.forEach( studyUID => {
                            studies.forEach(mountedStudy => {
                                if (mountedStudy.uid===studyUID && mountedStudy.status==="completed"){
                                    this.participatingCompletedFullStudies.push(mountedStudy);
                                }
                            })
                        });

                        this.model.numberOfCompletedStudies = this.participatingCompletedFullStudies.length;
                    });
                }
            }
        });
    }

    getAllStudyPermissions() {
        this.permissions = []

        const getPermissions = () => {
            return new Promise ((resolve, reject) => {
                this.dpService.getDPs((err, dPermission) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(dPermission)
                })
            })
        };

        getPermissions().then(data => {
            let DP = data && data.length > 0 ? data[0] : undefined
            if (DP){
                if( ("matches" in DP) && (DP.matches.length>0)) {
                    console.log("Found %d matches.", DP.matches.length);
                    DP.matches.forEach(match => {
                        if (match.dpermissionStartSharingDate) {
                            let permission = {
                                studyID: match.studyUID,
                                date: new Date(match.dpermissionStartSharingDate).toDateString(),
                                dataType: match.patient.patientDataType,
                                status: "Approved",
                                disabled: false
                            }
                            this.permissions.push(permission);
                        };
                        if (match.dpermissionStopSharingDate) {
                            let permission = {
                                studyID: match.studyUID,
                                date: new Date(match.dpermissionStopSharingDate).toDateString(),
                                dataType: match.patient.patientDataType,
                                status: "Revoked",
                                disabled: true
                            }
                            this.permissions.push(permission);
                        };
                        if (match.dpermissionRejectedDate) {
                            let permission = {
                                studyID: match.studyUID,
                                date: new Date(match.dpermissionRejectedDate).toDateString(),
                                dataType: match.patient.patientDataType,
                                status: "Rejected",
                                disabled: true
                            }
                            this.permissions.push(permission);
                        };
                    })
                }
            }

            const getStudies = () => {
                return new Promise ((resolve, reject) => {
                    this.studiesService.getStudies((err, allStudies) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(allStudies)
                    })
                })
            };

            getStudies().then(studies => {
                this.permissions.forEach( permission => {
                    studies.forEach(mountedStudy => {
                        if (mountedStudy.uid===permission.studyID){
                            permission.studyTitle = mountedStudy.title;
                            permission.studyStatus = mountedStudy.status;
                        }
                    })
                });
                console.log("Permissions: ", this.permissions)

                this.permissions.forEach(permission => {
                    if (permission.status==="Revoked") {
                        this.permissions.forEach(p => {
                            if (p.status==="Approved" && permission.studyID === p.studyID) {
                                p.disabled = true;
                            }
                        })
                    }
                    if (permission.studyStatus==="completed"){
                        permission.disabled = true;
                    }
                })

                this.model.numberOfStudyPermissions = this.permissions.length;
            });
        });
    }

    _attachHandlers() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('home');
        });
        this.onTagClick("participating-studies",()=>{
            this.navigateToPageTag("participating-studies", {
                participatingFullStudies: this.participatingFullStudies,
            });
        });

        this.onTagClick("pending-invitations",()=>{
            this.navigateToPageTag("pending-invitations", {
                invitationsFullStudies: this.invitationsFullStudies,
            });
        });

        this.onTagClick("completed-studies",()=>{
            this.navigateToPageTag("completed-studies", {
                participatingCompletedFullStudies: this.participatingCompletedFullStudies,
            });
        });

        this.onTagClick("permissions",()=>{
            this.navigateToPageTag("view-permission", {
                permissions: this.permissions
            });
        });
    }

    async initServices() {
        this.model.isLoading = true;
        this.profileService = ProfileService.getProfileService();
        this.profileService.getProfilePicture((err,data)=>{
            this.model.profilePicture = data
        })
        this.getPendingInvitations();
        this.getAllParticipatingStudies();
        this.getAllCompletedStudies();
        this.getAllStudyPermissions();
    }
}
