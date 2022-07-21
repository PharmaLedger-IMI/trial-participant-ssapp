const commonServices = require("common-services");
const {DPService, StudiesService} = commonServices;
const {WebcController} = WebCardinal.controllers;
const DataSourceFactory = commonServices.getDataSourceFactory();


export default class ViewPermissionController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.studyID = prevState.studyID;
        this.model.has = true;
        this.dpService = DPService.getDPService();
        this.studiesService = new StudiesService();
        this._attachHandlerGoBack();


        this.model.permissions = []

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
                            this.model.permissions.push(permission);
                        };
                        if (match.dpermissionStopSharingDate) {
                            let permission = {
                                studyID: match.studyUID,
                                date: new Date(match.dpermissionStopSharingDate).toDateString(),
                                dataType: match.patient.patientDataType,
                                status: "Revoked",
                                disabled: true
                            }
                            this.model.permissions.push(permission);
                        };
                        if (match.dpermissionRejectedDate) {
                            let permission = {
                                studyID: match.studyUID,
                                date: new Date(match.dpermissionRejectedDate).toDateString(),
                                dataType: match.patient.patientDataType,
                                status: "Rejected",
                                disabled: true
                            }
                            this.model.permissions.push(permission);
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
                this.model.permissions.forEach( permission => {
                    studies.forEach(mountedStudy => {
                        if (mountedStudy.uid===permission.studyID){
                            permission.studyTitle = mountedStudy.title;
                        }
                    })
                });
                console.log("Permissions: ", this.model.permissions)

                this.model.permissions.forEach(permission => {
                    if (permission.status==="Revoked") {
                        this.model.permissions.forEach(p => {
                            if (p.status==="Approved" && permission.studyID === p.studyID) {
                                p.disabled = true;
                            }
                        })
                    }
                })

                this.model.has_permissions = this.model.permissions.length > 0;
                this.model.permissionsDataSource = DataSourceFactory.createDataSource(8, 5, this.model.permissions);

                this.onTagClick("revoke", (model) => {
                    console.log("revoke");
                    //this.navigateToPageTag('view-permission', state)
                });

            });


        });





    }


    _attachHandlerGoBack() {
        this.onTagClick('navigation:go-back', () => {
            this.navigateToPageTag('completed-studies');
        });
    }


}
