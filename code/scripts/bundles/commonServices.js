commonServicesRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\builds\\tmp\\commonServices_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.commonServicesLoadModules = function(){ 

	if(typeof $$.__runtimeModules["common-services"] === "undefined"){
		$$.__runtimeModules["common-services"] = require("common-services");
	}
};
if (true) {
	commonServicesLoadModules();
}
global.commonServicesRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("commonServices");
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"common-services":"common-services"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\factories\\DataSourceFactory.js":[function(require,module,exports){
const { DataSource } = WebCardinal.dataSources;

class TableDataSource extends DataSource {
    constructor(data) {
        super();
        this.model.tableData = data;
    }

    setNumberOfColumns(noOfColumns) {
        return this.model.noOfColumns = noOfColumns;
    }

    setDataSourcePageSize(pageSize) {
        this.model.elements = pageSize;
        this.setPageSize(this.model.elements);
    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        if (this.model.tableData.length <= dataLengthForCurrentPage) {
            this.setPageSize(this.model.tableData.length);
        }
        else {
            this.setPageSize(this.model.elements);
        }
        let slicedData = [];
        this.setRecordsNumber(this.model.tableData.length);
        if (dataLengthForCurrentPage > 0) {
            slicedData = Object.entries(this.model.tableData).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
        } else {
            slicedData = Object.entries(this.model.tableData).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
        }
        return slicedData;
    }
}

class DataSourceFactory {

    static createDataSource(noOfColumns,itemsPerPage, data) { 
        const tableDataSource = new TableDataSource(data);

        tableDataSource.updateTable = function (newData) {
            this.model.tableData = newData;
            this.getElement().dataSize = newData.length;
            this.forceUpdate(true);
        }

        tableDataSource.setDataSourcePageSize(itemsPerPage);
        tableDataSource.setNumberOfColumns(noOfColumns);
        return tableDataSource;
    }
}

module.exports = DataSourceFactory

},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ConsentModel.js":[function(require,module,exports){
function getConsentModel() {
    return {
        ConsentId: {
            name: 'Consent System id',
            label: "consent_system_id",
            value: ''
        },
        ConsentIdentifier: {
            name: 'Consent Identifier',
            label: "consent_identifier",
            value: ''
        },
        ConsentStatus: {
            name: 'Consent Status',
            label: "consent_status",
            value: ''
        },
        ConsentScope: {
            name: 'Consent Scope',
            label: "consent_scope",
            value: ''
        },
        ConsentCategory: {
            name: 'Consent Category',
            label: "consent_category",
            value: ''
        },
        ConsentPatient: {
            name: 'Consent patient',
            label: "consent_patient",
            value: ''
        },
        ConsentDateTime: {
            name: 'Consent Date Time',
            label: "consent_date_time",
            value: ''
        },
        ConsentPerformer: {
            name: 'Consent Performer',
            label: "consent_performer",
            value: ''
        },
        ConsentOrganization: {
            name: 'Consent Organization',
            label: "consent_organization",
            value: ''
        },
        ConsentSource: {
            name: 'Consent Source',
            label: "consent_source",
            value: ''
        },
        ConsentPolicy: {
            name: 'Consent Policy',
            label: "consent_policy",
            value: ''
        },
        ConsentPolicyAuthority: {
            name: 'Consent Policy Authority',
            label: "consent_policy_authority",
            value: ''
        }, ConsentPolicyUri: {
            name: 'Consent Policy Uri',
            label: "consent_policy_uri",
            value: ''
        }, ConsentPolicyRule: {
            name: 'Consent Policy Rule',
            label: "consent_policy_rule",
            value: ''
        }
    };
}

module.exports = {
    getConsentModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ContractModel.js":[function(require,module,exports){
function getContractModel() {
    return {
        ContractId: {
            name: 'Contract System id',
            label: "contract_system_id",
            value: ''
        },
        ContractIdentifier: {
            name: 'Contract Identifier',
            label: "contract_identifier",
            value: ''
        },
        ContractVersion: {
            name: 'Contract Version',
            label: "contract_version",
            value: ''
        },
        ContractStatus: {
            name: 'Contract Status',
            label: "contract_status",
            value: ''
        },
        ContractIssued: {
            name: 'Contract Issued',
            label: "contract_issued",
            value: ''
        },
        ContractApplies: {
            name: 'Contract Applies',
            label: "contract_applies",
            value: ''
        },
        ContractSubject: {
            name: 'Contract Subject',
            label: "contract_subject",
            value: ''
        },
        ContractAuthority: {
            name: 'Contract Authority',
            label: "contract_authority",
            value: ''
        },
        ContractName: {
            name: 'Contract Name',
            label: "contract_name",
            value: ''
        },
        ContractTitle: {
            name: 'Contract Title',
            label: "contract_title",
            value: ''
        },
        ContractAuthor: {
            name: 'Contract Author',
            label: "contract_author",
            value: ''
        },
        ContractType: {
            name: 'Contract Type',
            label: "contract_type",
            value: ''
        },
        ContractSubtype: {
            name: 'Contract Subtype',
            label: "contract_subtype",
            value: ''
        },
        ContractTerm: {
            name: 'Contract Term',
            label: "contract_term",
            value: ''
        },
        ContractTermOffer: {
            name: 'Contract Term Offer',
            label: "contract_term_offer",
            value: ''
        },
        ContractTermOfferAnswer: {
            name: 'Contract Term Offer Answer',
            label: "contract_term_offer_answer",
            value: ''
        },
        ContractTermOfferNext: {
            name: 'Contract Term Offer Text',
            label: "contract_term_offer_text",
            value: ''
        }
    };
}

module.exports = {
    getContractModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\GroupModel.js":[function(require,module,exports){
function getGroupModel() {
    return {
        GroupId: {
            name: 'Group System id',
            label: "group_system_id",
            value: ''
        },
        GroupActive: {
            name: 'Group  Active',
            label: "group_active",
            value: ''
        },
        GroupType: {
            name: 'Group Type',
            label: "group_period",
            value: ''
        },
        GroupName: {
            name: 'Group Name',
            label: "group_name",
            value: ''
        },
        GroupQuantity: {
            name: 'Group Quantity',
            label: "group_quantity",
            value: ''
        },
        GroupManagingEntity: {
            name: 'Group Managing Entity',
            label: "group_managing_entity",
            value: ''
        },
        GroupMember: {
            name: 'Group Member',
            label: "group_member",
            value: ''
        },
        GroupMemberEntity: {
            name: 'Group Member Entity',
            label: "group_member_entity",
            value: ''
        },
        GroupMemberPeriod: {
            name: 'Group Member Period',
            label: "group_member_period",
            value: ''
        },
        GroupMemberInactive: {
            name: 'Group Member Inactive',
            label: "group_member_inactive",
            value: ''
        },
    };
}

module.exports = {
    getGroupModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\OrganizationModel.js":[function(require,module,exports){
function getOrganizationModel() {
    return {
        // HL7 Organization Model //
        OrganizationId: {
            name: 'Organization System id',
            label: "organization_system_id",
            value: ''
        },
        OrganizationIdentifier: {
            name: 'Organization Identifier',
            label: "organization_identifier",
            value: ''
        },
        OrganizationActive: {
            name: 'Organization Active',
            label: "organization_active",
            value: ''
        },
        OrganizationType: {
            name: 'Organization Type',
            label: "organization_type",
            value: ''
        },
        OrganizationName: {
            name: 'Organization Name',
            label: "organization_name",
            value: ''
        },
        OrganizationPartOf: {
            name: 'Organization Part Of',
            label: "organization_part_of",
            value: ''
        },

    };
}

module.exports = {
    getOrganizationModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PatientModel.js":[function(require,module,exports){
function getPatientModel() {
    return {
        PatientId: {
            name: 'Patient System id',
            label: "patient_system_id",
            value: ''
        },
        PatientIdentifier: {
            name: 'Patient Identifier',
            label: "patient_identifier",
            value: ''
        },
        PatientActive: {
            name: 'Patient Active',
            label: "patient_active",
            value: ''
        },
        PatientName: {
            name: 'Patient Name',
            label: "patient_name",
            value: ''
        },
        PatientGeneralPractitioner: {
            name: 'Patient General Practitioner',
            label: "patient_general_practitioner",
            value: ''
        },
        PatientManagingOrganization: {
            name: 'Patient Managing Organization',
            label: "patient_managing_organization",
            value: ''
        },
        PatientGender: {
            name: 'PatientGender',
            label: "patient_gender",
            value: ''
        },
        PatientBirthDate: {
            name: 'Patient Birth Date',
            label: "patient_birth_date",
            value: ''
        },
        PatientTelecom: {
            name: 'Patient Telecom',
            label: "patient_telecom",
            value: ''
        },
        password: {
            name: 'password',
            label: "Password",
            value: ''
        }
    };
}

module.exports = {
    getPatientModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PlanDefinitionModel.js":[function(require,module,exports){
function getPlanDefinitionModel() {
    return {
        PlanDefinitionId: {
            name: 'Plan Definition System id',
            label: "plan_definition_system_id",
            value: ''
        },
        PlanDefinitionUrl: {
            name: 'Plan Definition Url',
            label: "plan_definition_url",
            value: ''
        },
        PlanDefinitionIdentifier: {
            name: 'Plan Definition Identifier',
            label: "plan_definition_identifier",
            value: ''
        },
        PlanDefinitionVersion: {
            name: 'Plan Definition Version',
            label: "plan_definition_version",
            value: ''
        },
        PlanDefinitionName: {
            name: 'Plan Definition Name',
            label: "plan_definition_name",
            value: ''
        },
        PlanDefinitionTitle: {
            name: 'Plan Definition Title',
            label: "plan_definition_title",
            value: ''
        },
        PlanDefinitionType: {
            name: 'Plan Definition Type',
            label: "plan_definition_type",
            value: ''
        },
        PlanDefinitionStatus: {
            name: 'Plan Definition Status',
            label: "plan_definition_status",
            value: ''
        },
        PlanDefinitionDate: {
            name: 'Plan Definition Date',
            label: "plan_definition_date",
            value: ''
        },
        PlanDefinitionPublisher: {
            name: 'Plan Definition Publisher',
            label: "plan_definition_publisher",
            value: ''
        }
    };
}

module.exports = {
    getPlanDefinitionModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PractitionerModel.js":[function(require,module,exports){
function getPractitionerModel() {
    return {
        PractitionerId: {
            name: 'Practitioner System id',
            label: "practitioner_system_id",
            value: ''
        },
        PractitionerIdentifier: {
            name: 'Practitioner Identifier',
            label: "practitioner_identifier",
            value: ''
        },
        PractitionerActive: {
            name: 'Practitioner Active',
            label: "practitioner_active",
            value: ''
        },
        PractitionerName: {
            name: 'Practitioner Name',
            label: "practitioner_name",
            value: ''
        },
        PractitionerGender: {
            name: 'PractitionerGender',
            label: "practitioner_gender",
            value: ''
        }
    };
}

module.exports = {
    getPractitionerModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PractitionerRoleModel.js":[function(require,module,exports){
function getPractitionerRoleModel() {
    return {
        PractitionerRoleId: {
            name: 'Practitioner Role System id',
            label: "practitioner_role_system_id",
            value: ''
        },
        PractitionerRoleIdentifier: {
            name: 'Practitioner Role Identifier',
            label: "practitioner_role_identifier",
            value: ''
        },
        PractitionerRoleActive: {
            name: 'Practitioner Role Active',
            label: "practitioner_role_active",
            value: ''
        },
        PractitionerRolePeriod: {
            name: 'Practitioner Role Period',
            label: "practitioner_role_period",
            value: ''
        },
        PractitionerRolePractitioner: {
            name: 'Practitioner Role Practitioner',
            label: "practitioner_role_practitioner",
            value: ''
        },
        PractitionerRoleOrganization: {
            name: 'Practitioner Role Organization',
            label: "practitioner_role_organization",
            value: ''
        },
        PractitionerRoleCode: {
            name: 'Practitioner Role Code',
            label: "practitioner_role_code",
            value: ''
        },
    };
}

module.exports = {
    getPractitionerRoleModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\QuestionnaireModel.js":[function(require,module,exports){
function getQuestionnaireModel() {
    return {
        QuestionaireId: {
            name: 'Questionaire System id',
            label: "questionaire_system_id",
            value: ''
        },
        QuestionaireIdentifier: {
            name: 'Questionaire Identifier',
            label: "questionaire_identifier",
            value: ''
        },
        QuestionaireVersion: {
            name: 'Questionaire Version',
            label: "questionaire_version",
            value: ''
        },
        QuestionaireName: {
            name: 'Questionaire Name',
            label: "questionaire_name",
            value: ''
        },
        QuestionaireTitle: {
            name: 'Questionaire Title',
            label: "questionaire_title",
            value: ''
        },
        QuestionaireStatus: {
            name: 'Questionaire Status',
            label: "questionaire_status",
            value: ''
        },
        QuestionaireExperimental: {
            name: 'Questionaire Experimental',
            label: "questionaire_experimental",
            value: ''
        },
        QuestionaireSubjectType: {
            name: 'Questionaire Subject Type',
            label: "questionaire_subject_type",
            value: ''
        },
        QuestionaireDate: {
            name: 'Questionaire Date',
            label: "questionaire_date",
            value: ''
        },
        QuestionairePublisher: {
            name: 'Questionaire Publisher',
            label: "questionaire_publisher",
            value: ''
        },
        Questionairecontact: {
            name: 'Questionaire Contact',
            label: "questionaire_contact",
            value: ''
        },
        QuestionaireDescription: {
            name: 'Questionaire Description',
            label: "questionaire_description",
            value: ''
        },
        QuestionaireCopyright: {
            name: 'Questionaire Copyright',
            label: "questionaire_copyright",
            value: ''
        },
        QuestionaireApprovalDate: {
            name: 'Questionaire Approval Date',
            label: "questionaire_approval_date",
            value: ''
        },
        QuestionaireLastReviewDate: {
            name: 'Questionaire Last Review Date',
            label: "questionaire_last_review_date",
            value: ''
        },
        QuestionaireEffectivePeriod: {
            name: 'Questionaire Effective Period',
            label: "questionaire_effective_period",
            value: ''
        },
        QuestionaireCode: {
            name: 'Questionaire Code',
            label: "questionaire_code",
            value: ''
        },
        QuestionaireItem: {
            name: 'Questionaire Item',
            label: "questionaire_item",
            value: ''
        },
    };
}

module.exports = {
    getQuestionnaireModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\QuestionnaireResponseModel.js":[function(require,module,exports){
function getQuestionnaireResponseModel() {
    return {
        QuestionaireResponseId: {
            name: 'Questionaire Response System id',
            label: "questionaire_response_system_id",
            value: ''
        },
        QuestionaireResponsePartOf: {
            name: 'Questionaire Response Part Of',
            label: "questionaire_response_part_of",
            value: ''
        },
        QuestionaireResponseQuestionnaire: {
            name: 'Questionaire Response Questionnaire',
            label: "questionaire_response_questionnaire",
            value: ''
        },
        QuestionaireResponseStatus: {
            name: 'Questionaire Response Status',
            label: "questionaire_response_status",
            value: ''
        },
        QuestionaireResponseSubject: {
            name: 'Questionaire Response Subject',
            label: "questionaire_response_subject",
            value: ''
        },
        QuestionaireResponseAuthored: {
            name: 'Questionaire Response Authored',
            label: "questionaire_response_authored",
            value: ''
        },
        QuestionaireResponseAuthor: {
            name: 'Questionaire Response Author',
            label: "questionaire_response_author",
            value: ''
        },
        QuestionaireResponseSource: {
            name: 'Questionaire Response Source',
            label: "questionaire_response_source",
            value: ''
        },
        QuestionaireResponseItem: {
            name: 'Questionaire Response Item',
            label: "questionaire_response_item",
            value: ''
        }
    };
}

module.exports = {
    getQuestionnaireResponseModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\RelatedPersonModel.js":[function(require,module,exports){
function getRelatedPersonModel() {
    return {
        RelatedPersonId: {
            name: 'RelatedPerson System id',
            label: "relatedPerson_system_id",
            value: ''
        },
        RelatedPersonIdentifier: {
            name: 'RelatedPerson Identifier',
            label: "relatedPerson_identifier",
            value: ''
        },
        RelatedPersonActive: {
            name: 'RelatedPerson Active',
            label: "relatedPerson_active",
            value: ''
        },
        RelatedPersonPatient: {
            name: 'RelatedPerson Patient',
            label: "relatedPerson_patient",
            value: ''
        },
        RelatedPersonRelationship: {
            name: 'RelatedPerson Relationship',
            label: "relatedPerson_relationship",
            value: ''
        },
        RelatedPersonName: {
            name: 'RelatedPerson Name',
            label: "relatedPerson_name",
            value: ''
        },
        RelatedPersonGender: {
            name: 'RelatedPersonGender',
            label: "relatedPerson_gender",
            value: ''
        },
        RelatedPersonPeriod: {
            name: 'RelatedPerson Period',
            label: "relatedPerson_period",
            value: ''
        },
        RelatedPersonCommunication: {
            name: 'RelatedPerson Communication',
            label: "relatedPerson_communication",
            value: ''
        },
        RelatedPersonCommunicationLanguage: {
            name: 'RelatedPerson Communication Language',
            label: "relatedPerson_communication_language",
            value: ''
        },
        RelatedPersonCommunicationPreferred: {
            name: 'RelatedPerson Communication Preferred',
            label: "relatedPerson_communication_prefered",
            value: ''
        }
    };
}

module.exports = {
    getRelatedPersonModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ResearchStudyModel.js":[function(require,module,exports){
function getResearchStudyModel() {
    return {
        ResearchStudyId: {
            name: 'Research Study System id',
            label: "research_study_system_id",
            value: ''
        },
        ResearchStudyIdentifier: {
            name: 'Research Study Identifier',
            label: "research_study_identifier",
            value: ''
        },
        ResearchStudyTitle: {
            name: 'Research Study Title',
            label: "research_study_title",
            value: ''
        },
        ResearchStudyProtocol: {
            name: 'Research Study Protocol',
            label: "research_study_protocol",
            value: ''
        },
        ResearchStudyPartOf: {
            name: 'Research Study Part Of',
            label: "research_study_part_of",
            value: ''
        },
        ResearchStudyStatus: {
            name: 'Research Study Status',
            label: "research_study_status",
            value: ''
        },
        ResearchStudyPrimaryPurposeType: {
            name: 'Research Study Primary Purpose Type',
            label: "research_study_primary_purpose_type",
            value: ''
        },

        ResearchStudyPhase: {
            name: 'Research Study Phase',
            label: "research_study_phase",
            value: ''
        },

        ResearchStudyKeyword: {
            name: 'Research Study Keyword',
            label: "research_study_keyword",
            value: ''
        },

        ResearchStudyDescription: {
            name: 'Research Study Description',
            label: "research_study_description",
            value: ''
        },

        ResearchStudyPeriod: {
            name: 'Research Study Period',
            label: "research_study_period",
            value: ''
        },

        ResearchStudyEnrollment: {
            name: 'Research Study Enrollment',
            label: "research_study_enrollment",
            value: ''
        },

        ResearchStudySponsor: {
            name: 'Research Study Sponsor',
            label: "research_study_sponsor",
            value: ''
        },

        ResearchStudyPrincipalInvestigator: {
            name: 'Research Study Principal Investigator',
            label: "research_study_principal_investigator",
            value: ''
        },

        ResearchStudyReasonStopped: {
            name: 'Research Study Reason Stopped',
            label: "research_study_reason_stopped",
            value: ''
        },
    };
}

module.exports = {
    getResearchStudyModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ResearchSubjectModel.js":[function(require,module,exports){
function getResearchSubjectModel() {
    return {
        ResearchSubjectId: {
            name: 'Research Subject System id',
            label: "research_subject_system_id",
            value: ''
        },
        ResearchSubjectIdentifier: {
            name: 'Research Subject Identifier',
            label: "research_subject_identifier",
            value: ''
        },
        ResearchSubjectStatus: {
            name: 'Research Subject Status',
            label: "research_subject_status",
            value: ''
        },
        ResearchSubjectPeriod: {
            name: 'Research Subject Period',
            label: "research_subject_period",
            value: ''
        },
        ResearchSubjectStudy: {
            name: 'Research Subject Study',
            label: "research_subject_study",
            value: ''
        },
        ResearchSubjectIndividual: {
            name: 'Research Subject Individual',
            label: "research_subject_individual",
            value: ''
        },
        ResearchSubjectConsent: {
            name: 'Research Subject Consent',
            label: "research_subject_consent",
            value: ''
        },
    };
}

module.exports = {
    getResearchSubjectModel
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\index.js":[function(require,module,exports){
module.exports = {
    ConsentModel: require("./HL7/ConsentModel").getConsentModel(),
    ContractModel: require("./HL7/ContractModel").getContractModel(),
    GroupModel: require("./HL7/GroupModel").getGroupModel(),
    OrganizationModel: require("./HL7/OrganizationModel").getOrganizationModel(),
    PatientModel: require("./HL7/PatientModel").getPatientModel(),
    PlanDefinitionModel: require("./HL7/PlanDefinitionModel").getPlanDefinitionModel(),
    PractitionerModel: require("./HL7/PractitionerModel").getPractitionerModel(),
    PractitionerRoleModel: require("./HL7/PractitionerRoleModel").getPractitionerRoleModel(),
    QuestionnaireModel: require("./HL7/QuestionnaireModel").getQuestionnaireModel(),
    QuestionnaireResponseModel: require("./HL7/QuestionnaireResponseModel").getQuestionnaireResponseModel(),
    RelatedPersonModel: require("./HL7/RelatedPersonModel").getRelatedPersonModel(),
    ResearchStudyModel: require("./HL7/ResearchStudyModel").getResearchStudyModel(),
    ResearchSubjectModel: require("./HL7/ResearchSubjectModel").getResearchSubjectModel()
};
},{"./HL7/ConsentModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ConsentModel.js","./HL7/ContractModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ContractModel.js","./HL7/GroupModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\GroupModel.js","./HL7/OrganizationModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\OrganizationModel.js","./HL7/PatientModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PatientModel.js","./HL7/PlanDefinitionModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PlanDefinitionModel.js","./HL7/PractitionerModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PractitionerModel.js","./HL7/PractitionerRoleModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\PractitionerRoleModel.js","./HL7/QuestionnaireModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\QuestionnaireModel.js","./HL7/QuestionnaireResponseModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\QuestionnaireResponseModel.js","./HL7/RelatedPersonModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\RelatedPersonModel.js","./HL7/ResearchStudyModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ResearchStudyModel.js","./HL7/ResearchSubjectModel":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\HL7\\ResearchSubjectModel.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\others\\BreadCrumbManager.js":[function(require,module,exports){
const { WebcController } = WebCardinal.controllers;

class BreadCrumbManager extends WebcController {

    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.getState = () => this.state;
        const { breadcrumb, ...state } = prevState;
        this.breadcrumb = breadcrumb;
        this.state = state;
        this.breadcrumbHandler();
    }

    setBreadCrumb( breadcrumbData ) {
        this.breadcrumb.push({
            label: breadcrumbData.label,
            tag: breadcrumbData.tag,
            state: this.state
        });
        this.updateBreadcrumb();
        return JSON.parse(JSON.stringify(this.breadcrumb));
    }

    updateBreadcrumb() {
        let breadCrumbs = this.breadcrumb;

        for (let i = 0; i < breadCrumbs.length - 1; i++) {
            for (let k = i + 1; k < breadCrumbs.length; k++) {
                if (breadCrumbs[i].tag === breadCrumbs[k].tag) {
                    breadCrumbs[i].state = breadCrumbs[k].state;
                    breadCrumbs.splice(i + 1, breadCrumbs.length);
                    break;
                }
            }
        }

        breadCrumbs.forEach((segment, index) => {
            segment.disabled = index === breadCrumbs.length - 1;
        })

        breadCrumbs.forEach((segment, index) => {
            if (index < breadCrumbs.length - 1) {
                if (segment.state.hasOwnProperty('message') && Object.keys(segment.state.message).length > 0) {
                    segment.state.message = {};
                }
            }
        })

    }

    breadcrumbHandler() {
        this.onTagClick("breadcrumb-click", (segmentModel) => {

            let spliceIndex = this.breadcrumb.findIndex(segment => {
                return segment.tag === segmentModel.tag;
            })

            if (spliceIndex > -1) {
                this.breadcrumb.splice(spliceIndex);
            }

            this.navigateToPageTag(segmentModel.tag, { ...segmentModel.state, breadcrumb: this.breadcrumb });
        })
    }

}

module.exports = BreadCrumbManager;
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\repositories\\BaseRepository.js":[function(require,module,exports){
const opendsu = require('opendsu');
const storage = opendsu.loadApi('storage');

const {getSharedStorage} = require('../services/SharedStorage.js');

const TABLE_NAMES = {
    ALL: {
        DID_IDENTITIES: 'did_identities'
    },
    PATIENT: {
        NOTIFICATIONS: "notifications",
        TRIAL_PARTICIPANT: "trials_participant",
        ECOSESENT_STATUSES: "econsents_statuses",
        VISITS: "visits",
        QUESTIONS: "questions"
    },
    HCO: {
        NOTIFICATIONS: "notifications",
        TRIAL_PARTICIPANTS: "trials_participants",
        VISITS: "visits",
        TRIALS: "trials",
        QUESTIONS: "questions"
    }
}

class BaseRepository {

    constructor(tableName) {
        const DSUStorage = storage.getDSUStorage();
        this.StorageService = getSharedStorage(DSUStorage);
        this.tableName = tableName;
    }

    create = (key, value, callback) => this.StorageService.insertRecord(this.tableName, key, value, callback);

    createAsync = (key, value) => this.StorageService.insertRecordAsync(this.tableName, key, value);

    findBy = (key, callback) => this.StorageService.getRecord(this.tableName, key, callback);

    findByAsync = async (key) => this.StorageService.getRecordAsync(this.tableName, key);

    findAll = (callback) => this.StorageService.getAllRecords(this.tableName, callback);

    findAllAsync = async () => this.StorageService.getAllRecordsAsync(this.tableName);

    filter = (query, sort, limit, callback) => this.StorageService.filter(this.tableName, query, sort, limit, callback);

    filterAsync = async (query, sort, limit) => this.StorageService.filterAsync(this.tableName, query, sort, limit);

    update = (key, value, callback) => this.StorageService.updateRecord(this.tableName, key, value, callback);

    updateAsync = (key, value) => this.StorageService.updateRecordAsync(this.tableName, key, value);
}

const getInstance = (tableName) => {
    if (!allTables.includes(tableName)) {
        throw  new Error(`The table ${tableName} does not exists!`);
    }
    return new BaseRepository(tableName);
}

let toBeReturnedObject = {
    getInstance,
    identities: TABLE_NAMES
}

const allTables = [];

Object.keys(TABLE_NAMES).forEach(workspaceKey => {
    let workspace = TABLE_NAMES[workspaceKey];
    allTables.push(...Object.values(workspace));
})

module.exports = toBeReturnedObject;
},{"../services/SharedStorage.js":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\SharedStorage.js","opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\AbstractAPI.js":[function(require,module,exports){
const opendsu = require("opendsu");

class AbstractAPI {

    ADAPTER_PATH = "";

    constructor(serverEndpoint, adapterPath = this.ADAPTER_PATH) {
        this.ADAPTER_PATH = adapterPath;
        let SERVER_ENDPOINT = serverEndpoint || window.location.origin;
        if (SERVER_ENDPOINT[SERVER_ENDPOINT.length - 1] !== "/") {
            SERVER_ENDPOINT += "/";
        }
        this.serverEndpoint = SERVER_ENDPOINT;
        const endpointURL = new URL(SERVER_ENDPOINT);
        this.apiEndpoint = endpointURL.hostname;
        this.apiPort = endpointURL.port;
    }

    makeRequest(method, path, headers, body, callback) {
        if (typeof body === 'function') {
            callback = body;
            body = {};
        }
        console.log(`[${this.ADAPTER_PATH}][Request]`, method, path, JSON.stringify(body));
        const bodyData = JSON.stringify(body);
        const apiHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': bodyData.length,
            ...headers
        };
        const options = {
            hostname: this.apiEndpoint,
            headers: apiHeaders,
            port: this.apiPort,
            path,
            method
        };
        if (body && JSON.stringify(body) !== JSON.stringify({})) {
            options.body = bodyData;
        }
        let protocolInit = opendsu.loadAPI('http');
        protocolInit.fetch(this.serverEndpoint + path + "#x-blockchain-domain-request", options)
            .then(async (response) => {
                try {
                    const data = await response.json();
                    console.log(`[${this.ADAPTER_PATH}][Response]`, method, path, response.status, response.statusCode, data);
                    if (!response.ok) {
                        return callback(response);
                    }
                    callback(undefined, data);
                } catch (err) {
                    console.error('Response could not be transformed into JSON.');
                    return callback(err);
                }
            })
            .catch(error => {
                return callback(error);
            })
    }
}

module.exports = AbstractAPI;
},{"opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\CommunicationService.js":[function(require,module,exports){
const opendsu = require("opendsu");
const w3cDID = opendsu.loadAPI('w3cdid');
const scAPI = opendsu.loadAPI("sc");
const DidService = require("./DidService");
const messageQueueServiceInstance = require("./MessageQueueService");
const MAX_RECONNECTION_ATTEMPTS = 5;
const INITIAL_CONNECTION_DELAY = 1000;
const MAX_RECONNECT_DELAY = INITIAL_CONNECTION_DELAY * 30;

function getIotAdaptorEndpoint(endpoint) {
    return endpoint + "/iotAdapter/adaptorIdentity/";
}

class CommunicationService {

    /**
     * @param optionalDid: {didType: string, publicName: string}
     * <br /> <b>didType:</b> the type of the did (did:name, did:group...)
     * <br /> <b>publicName:</b> the public name used by the sender to send a message
     */
    constructor(optionalDid) {
        this.connectionDelay = INITIAL_CONNECTION_DELAY;
        this.reconnectionAttempts = 0;
        this.didReadyHandlers = [];
        if (!optionalDid || typeof optionalDid !== 'string') {
            return this.createOrLoadIdentity();
        }
        this.loadOptionalIdentity(optionalDid);

    }

    onPrimaryDidReady(callback) {
        if (!this.didDocument) {
            return this.didReadyHandlers.push(callback);
        }
        callback(undefined, this.didDocument)
    }

    notifySubscribers(err, didDocument) {
        while (this.didReadyHandlers.length > 0) {
            let handler = this.didReadyHandlers.pop();
            handler(err, didDocument);
        }
    }

    createOrLoadIdentity() {
        const sc = scAPI.getSecurityContext();
        sc.on("initialised", () => {
            let didService = DidService.getDidServiceInstance();
            didService.getEnvironmentData().then(async (envData) => {
                this.environmentData = envData;
                console.log(envData);
                const didData = DidService.getDidData(this.environmentData.did);

                try {
                    this.didDocument = await this.getDidDocumentInstance(didData);
                    this.notifySubscribers(undefined, this.didDocument);

                } catch (e) {
                    this.notifySubscribers(e);
                    console.log(e);
                }
            }).catch((e) => {
                console.error(e);
            });
        });
    }

    async loadOptionalIdentity(optionalDid) {

        const getDidData = (didString) => {
            const splitDid = didString.split(":");
            return {
                didType: `${splitDid[1]}:${splitDid[2]}`, publicName: splitDid[4], domain: splitDid[3]
            };
        }

        const didData = getDidData(optionalDid);
        try {
            this.didDocument = await this.getDidDocumentInstance(didData);
        } catch (e) {
            console.log(e);
        }
    }

    async getDidDocumentInstance(didData) {
        try {
            const didDocument = await this.resolveDidDocument(didData);
            console.log(`Identity ${didDocument.getIdentifier()} loaded successfully.`);
            return didDocument
        } catch (e) {
            try {
                const didDocument = await $$.promisify(w3cDID.createIdentity)(didData.didType, didData.domain, didData.publicName);
                console.log(`Identity ${didDocument.getIdentifier()} created successfully.`);
                return didDocument;
            } catch (e) {
                console.log(`DID creation failed for didType:'${didData.didType}' , publicName: '${didData.publicName}' , domain: '${didData.domain}'`)
                throw e;
            }
        }
    }

    async resolveDidDocument(didData) {
        const {didType, domain, publicName} = didData;
        try {
            const identifier = `did:${didType}:${domain}:${publicName}`;
            return await $$.promisify(w3cDID.resolveDID)(identifier);
        } catch (e) {
            console.log(`DID resolve failed for didType:'${didType}' , publicName: '${publicName}'`)
            throw e;
        }
    }

    async sendMessage(receiverDid, data) {
        if (!this.didDocument) {
            return this.sleep(async () => {
                await this.sendMessage(receiverDid, data);
            });
        }

        let receiverDidData = DidService.getDidData(receiverDid);

        try {
            const receiverDidDocument = await this.resolveDidDocument(receiverDidData);
            //temporary: trust the sender that he is who pretends to be: @senderIdentity
            data = {
                ...data, senderIdentity: await DidService.getDidServiceInstance().getDID()
            }
            return new Promise((resolve, reject) => {
                this.didDocument.sendMessage(JSON.stringify(data), receiverDidDocument, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            })

        } catch (e) {
            console.log(`[ERROR] Could not send message to did '${receiverDid}'. Does it exists?`);
            console.error(e);
        }
    }

    async sendMessageToIotAdapter(data) {
        if (typeof this.environmentData.iotAdaptorEndpoint === "undefined") {
            throw new Error("iotAdaptorEndpoint not set in environment.js");
        }
        return fetch(getIotAdaptorEndpoint(this.environmentData.iotAdaptorEndpoint), {
            mode: 'cors'
        }).then(async response => {
            response.json().then(async (didMessage) => {
                await this.sendMessage(didMessage.message, data);
            })

        }).catch(e => {
            console.log(e);
        });
    }

    listenForMessages(callback) {
        if (!this.didDocument) {
            return this.sleep(() => {
                this.listenForMessages(callback);
            });
        }

        this.didDocument.readMessage((err, decryptedMessage) => {
            if (err) {
                if (this.establishedConnectionCheckId) {
                    clearTimeout(this.establishedConnectionCheckId);
                }

                if (this.pendingReadRetryTimeoutId) {
                    clearTimeout(this.pendingReadRetryTimeoutId);
                }
                if (this.reconnectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
                    if (this.connectionDelay < MAX_RECONNECT_DELAY) {
                        this.connectionDelay = this.connectionDelay * 2;
                    }

                    this.pendingReadRetryTimeoutId = setTimeout(() => {
                        this.reconnectionAttempts++;
                        console.log("Reading message attempt #", this.reconnectionAttempts)
                        this.listenForMessages(callback);
                        this.establishedConnectionCheckId = setTimeout(() => {
                            this.connectionDelay = INITIAL_CONNECTION_DELAY;
                            this.reconnectionAttempts = 0;
                            console.log("[MQ] Reconnecting was successfully ...")
                        }, MAX_RECONNECT_DELAY)

                    }, this.connectionDelay);
                } else {
                    callback(new Error('Unexpected error occurred. Please refresh your application'));
                }
            } else {
                messageQueueServiceInstance.addCallback(async () => {
                    await callback(err, decryptedMessage);
                    this.listenForMessages(callback);
                });
            }
        });
    }

    sleep(callback) {
        const time = 500;
        setTimeout(() => {
            callback();
        }, time);
    }
}

let instance = null;
let extraCommunicationInstances = {};
const getCommunicationServiceInstance = () => {
    if (instance === null) {
        instance = new CommunicationService();
    }

    return instance;
};

const getExtraCommunicationService = (optionalDid) => {
    if (!extraCommunicationInstances[optionalDid]) {
        extraCommunicationInstances[optionalDid] = new CommunicationService(optionalDid);
    }
    return extraCommunicationInstances[optionalDid];
}

module.exports = {
    getCommunicationServiceInstance, getExtraCommunicationService,
};
},{"./DidService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DidService.js","./MessageQueueService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\MessageQueueService.js","opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js":[function(require,module,exports){
const opendsu = require('opendsu');
const storage = opendsu.loadApi('storage');
const resolver = opendsu.loadAPI('resolver');
const keySSISpace = opendsu.loadAPI('keyssi');
class DSUService {
  PATH = '/';

  constructor(path = this.PATH) {
    this.DSUStorage = storage.getDSUStorage();
    this.PATH = path;
  }

  refreshDSU(ssi, callback) {
    resolver.invalidateDSUCache(ssi);
    resolver.loadDSU(ssi, callback);
  }

  letDSUStorageInit = () => {
    if (typeof this.initializationPromise === 'undefined') {
      this.initializationPromise = new Promise((resolve) => {
        if (this.DSUStorage === undefined || this.DSUStorage.directAccessEnabled === true) {
          return resolve();
        }
        this.DSUStorage.enableDirectAccess(() => {
          resolve();
        });
      });
    }
    return this.initializationPromise;
  };

  getFilteredEntities(path, filterPath, callback){
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.listMountedDSUs(path, (err, dsuList) => {
        if (err) {
          return callback(err, undefined);
        }
        dsuList = dsuList.filter(dsu => dsu.path.startsWith(filterPath + "/"));
        this.readDSUsData(dsuList, callback);
      });
    });
  }

  readDSUsData(dsuList, callback){
    const resolver = opendsu.loadAPI('resolver');
    let entities = [];
    let getServiceDsu = (dsuItem) => {
      let objectName = this.PATH.substring(1);
      let itemPathSplit = dsuItem.path.split('/');
      if (itemPathSplit.length > 1) {
        objectName = itemPathSplit[0];
      }
      resolver.loadDSU(dsuItem.identifier, (err, dsu) => {
        if (err) {
          return callback(err);
        }
        dsu.readFile('/data.json', (err, content) => {
          if (err) {
            entities.slice(0);
            return callback(err, undefined);
          }
          let entity = JSON.parse(content.toString());
          entity.objectName = objectName;
          entities.push(entity);

          if (dsuList.length === 0) {
            return callback(undefined, entities);
          }
          getServiceDsu(dsuList.shift());
        });
      });
    };
    if (dsuList.length === 0) {
      return callback(undefined, []);
    }
    getServiceDsu(dsuList.shift());
  }

  getEntities(path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.listMountedDSUs(path, (err, dsuList) => {
        if (err) {
          return callback(err, undefined);
        }
        this.readDSUsData(dsuList, callback);
      });
    });
  }

  async getEntitiesAsync(path) {
    return this.asyncMyFunction(this.getEntities, [...arguments]);
  }

  getEntity(uid, path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.getItem(this._getDsuStoragePath(uid, path), (err, content) => {
        if (err) {
          return callback(err, undefined);
        }
        let textDecoder = new TextDecoder('utf-8');
        callback(undefined, JSON.parse(textDecoder.decode(content)));
      });
    });
  }

  async getEntityAsync(uid, path) {
    return this.asyncMyFunction(this.getEntity, [...arguments]);
  }

  createDSUAndMount(path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    const resolver = opendsu.loadAPI('resolver');
    const keySSISpace = opendsu.loadAPI('keyssi');
    const config = opendsu.loadAPI('config');

    config.getEnv('domain', (err, domain) => {
      if (err || !domain) {
        domain = 'default';
      }
      const templateSSI = keySSISpace.createTemplateSeedSSI(domain);
      resolver.createDSU(templateSSI, (err, dsuInstance) => {
        if (err) {
          return callback(err);
        }
        dsuInstance.getKeySSIAsString((err, keySSI) => {
          if (err) {
            return callback(err);
          }
          this.letDSUStorageInit().then(() => {
            const keySSIObj = keySSISpace.parse(keySSI);
            const anchorId = keySSIObj.getAnchorId();

            this.DSUStorage.mount(path + '/' + anchorId, keySSI, (err) => {
              callback(err, keySSI);
            });
          });
        });
      });
    });
  }

  saveEntity(entity, path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);

    const config = opendsu.loadAPI('config');

    config.getEnv('domain', (err, domain) => {
      if (err || !domain) {
        domain = 'default';
      }

      const templateSSI = keySSISpace.createTemplateSeedSSI(domain);
      resolver.createDSU(templateSSI, (err, dsuInstance) => {
        if (err) {
          console.log(err);
          return callback(err);
        }

        dsuInstance.getKeySSIAsString((err, seedSSI) => {
          if (err) {
            return callback(err);
          }

          const keySSIObj = keySSISpace.parse(seedSSI);
          const anchorId = keySSIObj.getAnchorId();

          dsuInstance.getKeySSIAsString('sread', (err, sreadSSI) => {
            if (err) {
              return callback(err);
            }
            this.letDSUStorageInit().then(() => {
              this.DSUStorage.mount(path + '/' + anchorId, seedSSI, (err) => {
                if (err) {
                  console.log(err);
                }
                entity.uid = anchorId;

                this.updateEntity(entity, path, (err, entity) => {
                  if (err) {
                    return callback(err, entity);
                  }

                  entity.keySSI = seedSSI;
                  entity.sReadSSI = sreadSSI;
                  callback(undefined, entity);
                });
              });
            });
          });
        });
      });
    });
  }

  async saveEntityAsync(entity, path) {
    return this.asyncMyFunction(this.saveEntity, [...arguments]);
  }

  updateEntity(entity, path, callback) {
    entity.volatile = undefined;
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.setObject(this._getDsuStoragePath(entity.uid, path), entity, (err) => {
        if (err) {
          return callback(err, undefined);
        }
        callback(undefined, entity);
      });
    });
  }

  async updateEntityAsync(entity, path) {
    return this.asyncMyFunction(this.updateEntity, [...arguments]);
  }

  mountEntity(keySSI, path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);

    const keySSIObj = keySSISpace.parse(keySSI);
    const anchorId = keySSIObj.getAnchorId();
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.mount(path + '/' + anchorId, keySSI, (err) => {
        this.getEntity(anchorId, path, (err, entity) => {
          if (err) {
            return callback(err, undefined);
          }
          callback(undefined, entity);
        });
      });
    });
  }

  async mountEntityAsync(keySSI, path) {
    return this.asyncMyFunction(this.mountEntity, [...arguments]);
  }

  unmountEntity(uid, path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    let unmountPath = path + '/' + uid;
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.unmount(unmountPath, (err, result) => {
        if (err) {
          return callback(err, undefined);
        }
        callback(undefined, result);
      });
    });
  }

  async unmountEntityAsync(uid, path) {
    return this.asyncMyFunction(this.unmountEntity, [...arguments]);
  }

  getSReadSSI(seedSSI) {
    const keySSISpace = opendsu.loadAPI('keyssi');
    let parsedSeedSSI = keySSISpace.parse(seedSSI);
    return parsedSeedSSI.derive().getIdentifier();
  }

  getAnchorId(ssi) {
    const keySSIObj = keySSISpace.parse(ssi);
    return keySSIObj.getAnchorId();
  }

  _getDsuStoragePath(keySSI, path = this.PATH) {
    return path + '/' + keySSI + '/data.json';
  }

  swapParamsIfPathIsMissing(path, callback) {
    return typeof path === 'function' ? [this.PATH, path] : [path, callback];
  }

  asyncMyFunction = (func, params) => {
    func = func.bind(this);
    return new Promise((resolve, reject) => {
      func(...params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };

  cloneDSU = (fromDSUSSI, toDSUPath, callback) => {
    this.createDSUAndMount(toDSUPath, (err, keySSI) => {
      if (err) {
        return callback(err);
      }
      this.copyDSU(fromDSUSSI, keySSI, (err, copiedFiles) => {
        if (err) {
          return callback(err);
        }
        let cloneDetails = {
          ssi: keySSI,
          copiedFiles: copiedFiles,
        };
        callback(undefined, cloneDetails);
      });
    });
  };

  copyDSU = (fromDSUSSI, toDSUSSI, callback) => {
    const resolver = opendsu.loadAPI('resolver');
    resolver.loadDSU(fromDSUSSI, { skipCache: true }, (err, fromDSU) => {
      if (err) {
        return callback(err);
      }
      resolver.loadDSU(toDSUSSI, { skipCache: true }, (err, toDSU) => {
        if (err) {
          return callback(err);
        }
        fromDSU.listFiles('/', (err, files) => {
          if (err) {
            return callback(err);
          }
          let copiedFiles = [];
          let copyFileToDSU = (file) => {
            fromDSU.readFile(file, (err, data) => {
              if (err) {
                return copyFileToDSU(files.pop());
              }
              if (file === 'data.json') {
                data = JSON.parse(data.toString());
                data.genesisUid = data.uid;
                data.uid = this.getAnchorId(toDSUSSI);
                data.KeySSI = toDSUSSI;
                data.keySSI = toDSUSSI;
                data = JSON.stringify(data);
              }
              toDSU.writeFile(file, data, (err) => {
                if (err) {
                  return callback(err);
                }

                copiedFiles.push(file);
                if (files.length === 0) {
                  return callback(undefined, copiedFiles);
                }
                copyFileToDSU(files.pop());
              });
            });
          };
          copyFileToDSU(files.pop());
        });
      });
    });
  };

  copyFile(path, destination, callback) {
    this.readFile(path,(err,data) => {
      if(err) {
        return callback(err);
      }
      this.writeFile(destination, data, callback)
    })
  }

  readFile(path, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.readFile(path, (err, data) => {
        if (err) {
          return callback(err, undefined);
        }
        return callback(null, data);
      });
    });
  }

  writeFile(path, filebuffer, callback) {
    [path, callback] = this.swapParamsIfPathIsMissing(path, callback);
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.writeFile(path, filebuffer, (err, data) => {
        if (err) {
          return callback(err, undefined);
        }
        return callback(null, data);
      });
    });
  }

  async readFileAsync(path) {
    return this.asyncMyFunction(this.readFile, [...arguments]);
  }

  getEntityPath(keySSI, pathPrefix, callback) {
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.listMountedDSUs(pathPrefix, (err, dsuList) => {
        const dsu = dsuList.find((dsu) => dsu.identifier === keySSI);
        if (!dsu) {
          return callback(undefined, keySSI);
        }
        callback(undefined, dsu.path);
      });
    });
  }

  async getEntityPathAsync(knownIdentifier, pathPrefix) {
    return this.asyncMyFunction(this.getEntityPath, [...arguments]);
  }

  getEntityMountSSI(pathPrefix, entityUid, callback) {
    if(typeof entityUid ==="function"){
      callback = entityUid;
      entityUid = undefined;
    }
    this.letDSUStorageInit().then(() => {
      this.DSUStorage.listMountedDSUs(pathPrefix, (err, dsuList) => {
        if (err) {
          return callback(err);
        }
        if (dsuList.length === 0) {
          return callback(new Error('No mounted entity found for ' + pathPrefix));
        }

        const targetedDSU = entityUid ? dsuList.find(dsu => dsu.path === entityUid) : dsuList[0];
        return callback(undefined, targetedDSU.identifier);
      });
    });
  }
}

module.exports = DSUService;

},{"opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DateTimeService.js":[function(require,module,exports){
const convertStringToLocaleDate = (dateAsString = new Date().toString(), locale) => {
    return new Date(dateAsString).toLocaleDateString(locale);
}

const convertStringToLocaleDateTimeString = (dateAsString = new Date().toString(), locale) => {
    return new Date(dateAsString).toLocaleString(locale);
}

const getCurrentDate = () => {
    return new Date();
}

const getCurrentDateAsISOString = () => {
    return getCurrentDate().toISOString();
}


const timeAgo  = (time, shortType = false) => {
    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    const time_formats = shortType?[
        [60, 's', 1], // 60
        [120, '1 m', '1 m'], // 60*2
        [3600, 'm', 60], // 60*60, 60
        [7200, '1 h', '1 h'], // 60*60*2
        [86400, 'h', 3600], // 60*60*24, 60*60
        [172800, 'y', 't'], // 60*60*24*2
        [604800, 'd', 86400], // 60*60*24*7, 60*60*24
        [1209600, '1 w', '1 w'], // 60*60*24*7*4*2
        [2419200, 'w', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, '1 m', '1 m'], // 60*60*24*7*4*2
        [29030400, 'm', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, '1 y', 'y'], // 60*60*24*7*4*12*2
        [2903040000, 'y', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'l.c', 'n.c'], // 60*60*24*7*4*12*100*2
        [58060800000, 'c', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ]:[
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - time) / 1000,
        token = shortType?"" : 'ago',
        list_choice = 1;

    if (seconds === 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    let i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return time;
}

function convertDateToInputValue(date) {
    //<input type="date">the browsers support only value in the format yyyy-mm-dd
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


module.exports = {
    convertDateToInputValue,
    convertStringToLocaleDate,
    convertStringToLocaleDateTimeString,
    getCurrentDate,
    getCurrentDateAsISOString,
    timeAgo
};

},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DidService.js":[function(require,module,exports){
function toHex(input) {
    input = Math.abs(input.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
    let hash = "",
        alphabet = "0123456789abcdef",
        alphabetLength = alphabet.length;

    do {
        hash = alphabet[input % alphabetLength] + hash;
        input = parseInt(input / alphabetLength, 10);
    } while (input);

    return hash;

}

class DidService {

    constructor() {
        this.environmentData = null;
    }

    static getDidData(didString) {
        const splitDid = didString.split(":");
        return {
            didType: `${splitDid[1]}:${splitDid[2]}`,
            publicName: splitDid[4],
            domain: splitDid[3]
        };
    }

    getUserDetails(callback) {
        const fetch = require("../utils/fetch");
        fetch('/api-standard/user-details')
            .then((response) => response.json())
            .then((userDetails) => {
                callback(null, userDetails);
            })
            .catch((err) => {
                console.log(`Failed to load user-details`, err);
                callback(err);
            });
    }

    async getWalletDomain() {
        const opendsu = require("opendsu");
        const config = opendsu.loadAPI("config");

        let domain = await $$.promisify(config.getEnv)("domain");
        if (!domain) {
            throw new Error("No domain was set up in the environment configuration file.")
        }
        return domain;
    }

    async getDID() {
        return new Promise(async (resolve, reject) => {
            this.getEnvironmentData().then(data => {
                resolve(data.did);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async getEnvironmentData() {
        return new Promise(async (resolve, reject) => {
            if (this.environmentData) {
                return resolve(this.environmentData);
            }

            const opendsu = require("opendsu");
            const scAPI = opendsu.loadApi("sc");

            const mainDSU = await $$.promisify(scAPI.getMainDSU)();
            const envData = JSON.parse(await $$.promisify(mainDSU.readFile)("environment.json"));

            if (typeof window !== "undefined") {
                return this.getUserDetails(async (err, userDetails) => {
                    if (err) {
                        return reject(err);
                    }

                    const domain = await this.getWalletDomain();
                    const {email, company, password, username} = userDetails;
                    const randomData = `${email}${company}${password}`;
                    const hashCode = toHex(randomData);

                    const did = `did:ssi:name:${domain}:${username}/${hashCode}`;
                    this.environmentData = {
                        ...envData,
                        did: did
                    };

                    resolve(this.environmentData);
                });
            }

            if (!envData.hasOwnProperty("did")) {
                return reject("No did set in environment.js");
            }

            this.environmentData = envData;
            resolve(this.environmentData);
        });
    }
}


let instance = null;
const getDidServiceInstance = () => {
    if (instance === null) {
        instance = new DidService();
    }
    return instance;
};

module.exports = {
    getDidServiceInstance,
    getDidData: DidService.getDidData
};

},{"../utils/fetch":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\fetch.js","opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\JWTService.js":[function(require,module,exports){
const openDSU = require('opendsu');
const credentials = openDSU.loadApi('credentials');
const validationStrategies = credentials.validationStrategies;
const validationStrategiesTypes = validationStrategies.VALIDATION_STRATEGIES;

class JWTService {

    async createVerifiableCredential(issuer, subject, options) {
        return await credentials.createJWTVerifiableCredentialAsync(issuer, subject, options);
    }

    async verifyCredential(encodedJWTVerifiableCredential, rootsOfTrust = []) {
        const jwtVcInstance = await credentials.loadJWTVerifiableCredentialAsync(encodedJWTVerifiableCredential);
        const verifyCredentialStatus = await jwtVcInstance.verifyJWTAsync(rootsOfTrust);

        console.log(jwtVcInstance, verifyCredentialStatus);
        return {jwtVcInstance, verifyCredentialStatus};
    }

    async createVerifiablePresentation(issuer, options) {
        return await credentials.createJWTVerifiablePresentationAsync(issuer, options);
    }

    async verifyPresentation(encodedJWTVerifiablePresentation, rootsOfTrust = []) {
        const loadedPresentation = await credentials.loadJWTVerifiablePresentationAsync(encodedJWTVerifiablePresentation);
        const verifyPresentationStatus = await loadedPresentation.verifyJWTAsync(rootsOfTrust);

        console.log(verifyPresentationStatus);
        return verifyPresentationStatus;
    }

    async createVerifiableCredentialForAnonymousPatient(clinicalSiteDID, trialParticipantDID, claimsToEmbed) {
        const {subjectClaims, publicClaims} = claimsToEmbed;
        const jwtVcInstance = await this.createVerifiableCredential(clinicalSiteDID, trialParticipantDID);

        if (subjectClaims) {
            // TODO: Create a minimal JSON-LD schema and make it available via API-hub middleware + update URI
            await jwtVcInstance.embedSubjectClaimAsync("https://clinical-site-wallet.dev/AnonymousDID", "AnonymousDID", subjectClaims);
        }

        if (publicClaims) {
            for (const claimName of Object.keys(publicClaims)) {
                await jwtVcInstance.embedClaimAsync(claimName, publicClaims[claimName]);
            }
        }

        const encodedJWTVc = await jwtVcInstance.getEncodedJWTAsync();

        console.log('encoded jwt vc of anonymous trial participant', encodedJWTVc);
        return encodedJWTVc;
    }

    async createVerifiablePresentationWithAnonymousPatient(clinicalSiteDID, tpEncodedJWTVc) {
        const jwtVpInstance = await this.createVerifiablePresentation(clinicalSiteDID, {credentialsToPresent: [tpEncodedJWTVc]});
        const encodedJWTVp = await jwtVpInstance.getEncodedJWTAsync();

        console.log('encoded jwt vp for anonymous trial participant', encodedJWTVp);
        return encodedJWTVp;
    }

    async validatePresentationOfAnonymousPatient(tpEncodedJWTVp, environmentData) {
        const jwtVpVerifyResult = await this.verifyPresentation(tpEncodedJWTVp, environmentData.rootsOfTrust);
        const tpDecodedVerifiableCredential = jwtVpVerifyResult.vp.verifiableCredential[0];

        const validationResult = await validationStrategies.validatePresentationAsync(
            [validationStrategiesTypes.DEFAULT, validationStrategiesTypes.ROOTS_OF_TRUST],
            environmentData,
            jwtVpVerifyResult);
        console.log('trial participant details from presentation: ', jwtVpVerifyResult, tpDecodedVerifiableCredential);
        console.log('validation result: ', validationResult);

        return {
            jwtVpVerifyResult,
            validationResult,
            tpDecodedVerifiableCredential
        };
    }
}

module.exports = JWTService;
},{"opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\MessageHandlerService.js":[function(require,module,exports){
const {getCommunicationServiceInstance, getExtraCommunicationService} = require("./CommunicationService");

class MessageHandlerService {

    constructor(did, newMessageHandler) {
        if(typeof did === 'function') {
            newMessageHandler = did;
            did = null;
        }
        this.communicationService = did ? getExtraCommunicationService(did) : getCommunicationServiceInstance();
        this.newMessageHandler = newMessageHandler;

        this.communicationService.listenForMessages(this.mqListenerHandler);
    }

    mqListenerHandler = async (err, message) => {
        if (err) {
            if (err.originalMessage === "socket hang up") {
                console.log("Reloading after " + err.originalMessage);
                return this.communicationService.listenForMessages(this.mqListenerHandler);
            }

            // TODO: Check for other types of errors that should be handled and to restart the listener
            return console.error(err);
        }
        await this.newMessageHandler(message);
    }
}

let instance = null;
let customMessageHandlers = {};
const init = (newMessageHandler) => {
    if (instance === null) {
        instance = new MessageHandlerService(newMessageHandler);
    }
    return instance;
};

const initCustomMessageHandler = (did, messageHandler) => {
    if(!customMessageHandlers[did]) {
        customMessageHandlers[did] = new MessageHandlerService(did, messageHandler);
    }
    return customMessageHandlers[did];
}


module.exports = {init,initCustomMessageHandler};
},{"./CommunicationService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\CommunicationService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\MessageQueueService.js":[function(require,module,exports){
class MessageQueueService {

    constructor() {
        this.messageCallbacks = [];
        this.inProgress = false;
    }

    addCallback(callback) {
        this.messageCallbacks.push(callback);
        if (!this.inProgress) {
            this.run();
        }
    }

    run() {
        if (this.messageCallbacks.length > 0) {
            this.inProgress = true;
            let callback = this.messageCallbacks.pop();
            callback().then(() => {
                this.inProgress = false;
                this.run();
            })
        }
    }
}

let messageQueueServiceInstance = new MessageQueueService();
module.exports = messageQueueServiceInstance;
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\SharedStorage.js":[function(require,module,exports){
const opendsu = require("opendsu");
const keySSISpace = opendsu.loadApi('keyssi')
const KEYSSI_FILE_PATH = 'keyssi.json';
const indexedTimestampField = "__timestamp";

class SharedStorage {

    constructor(dsuStorage) {
        const scApi = opendsu.loadApi("sc");
        scApi.getMainEnclave((err, enclaveDB) => {
            if (err) {
                return console.log(err);
            }
            this.mydb = enclaveDB;
            this.DSUStorage = dsuStorage;
        });
    }

    filter = (tableName, query, sort, limit, callback) => this.letDatabaseInit()
        .then(() => this.mydb.filter(tableName, query, sort, limit, callback)).catch(this.logError);

    filterAsync = async (tableName, query, sort, limit) => this.asyncMyFunction(this.filter, [tableName, query, sort, limit]);

    getRecord = (tableName, key, callback) => this.letDatabaseInit()
        .then(() => this.mydb.getRecord(tableName, key, callback)).catch(this.logError);

    getRecordAsync = async (tableName, key) => this.asyncMyFunction(this.getRecord, [tableName, key]);

    getAllRecords = (tableName, callback) => this.letDatabaseInit()
        .then(() => this.filter(tableName, callback)).catch(this.logError);

    getAllRecordsAsync = async (tableName) => this.asyncMyFunction(this.getAllRecords, [tableName]);

    insertRecord = (tableName, key, record, callback) => {
        if (typeof record === 'function') {
            callback = record;
        }
        if ((typeof record === 'function') || (typeof record === 'undefined' && typeof callback === 'function')) {
            record = key;
            key = this.generateGUID();
            record.uid = key;
        }
        this.letDatabaseInit()
            .then(() => {
                this.mydb.getIndexedFields(tableName, (err, indexedFields) => {
                    if (err) {
                        return callback(err);
                    }
                    if (!indexedFields.includes(indexedTimestampField)) {
                        return this.mydb.addIndex(tableName, indexedTimestampField, ()=>{
                            return this.mydb.insertRecord(tableName, key, record, () => this.getRecord(tableName, key, callback));
                        });
                    }
                    return this.mydb.insertRecord(tableName, key, record, () => this.getRecord(tableName, key, callback));
                    });
            })
            .catch(this.logError);
    }

    insertRecordAsync = async (tableName, key, record) => this.asyncMyFunction(this.insertRecord, [tableName, key, record]);

    updateRecord = (tableName, key, record, callback) => this.letDatabaseInit()
        .then(() => this.mydb.updateRecord(tableName, key, record, callback)).catch(this.logError);

    updateRecordAsync = async (tableName, key, record) => this.asyncMyFunction(this.updateRecord, [tableName, key, record]);

    deleteRecord = (tableName, key, callback) => this.letDatabaseInit()
        .then(() => this.mydb.deleteRecord(tableName, key, callback)).catch(this.logError);

    deleteRecordAsync = async (tableName, key, record) => this.asyncMyFunction(this.deleteRecord, [tableName, key, record]);

    beginBatch = () => this.letDatabaseInit()
        .then(() => this.mydb.beginBatch()).catch(this.logError);

    beginBatchAsync = async () => this.asyncMyFunction((callback) => {
        this.letDatabaseInit()
            .then(() => {
                this.mydb.beginBatch();
                callback();
            }).catch(this.logError);
    }, []);

    cancelBatch = (callback) => this.letDatabaseInit()
        .then(() => this.mydb.cancelBatch(callback)).catch(this.logError);

    cancelBatchAsync = async () => this.asyncMyFunction(this.cancelBatch, []);

    commitBatch = (callback) => this.letDatabaseInit()
        .then(() => this.mydb.commitBatch(callback)).catch(this.logError);

    commitBatchAsync = async () => this.asyncMyFunction(this.commitBatch, []);

    letDatabaseInit = () => {
        return new Promise((resolve) => {
            const checkDatabaseState = () => {
                if (this.mydb !== undefined) {
                    clearInterval(repeatDatabaseCheck);
                    resolve();
                }
            }
            let repeatDatabaseCheck = setInterval(checkDatabaseState, 10);
        });
    }

    logError = (err) => {
        console.error(err);
    }

    asyncMyFunction = (func, params) => {
        func = func.bind(this);
        return new Promise((resolve, reject) => {
            func(...params, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            })
        })
    }

    getSharedSSI = (callback) => {
        this.DSUStorage.listFiles('/', (err, fileList) => {
            if (err) {
                return callback(err);
            }
            if (fileList.includes(KEYSSI_FILE_PATH)) {
                this.DSUStorage.getObject(KEYSSI_FILE_PATH, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    const parsed = keySSISpace.parse(data.sharedSSI);
                    callback(undefined, parsed);
                });
            } else {
                return this.createSharedSSI(callback);
            }
        });
    }

    createSharedSSI = (callback) => {
        const ssi = keySSISpace.createSeedSSI('default');
        this.DSUStorage.setObject(KEYSSI_FILE_PATH, { sharedSSI: ssi.derive().getIdentifier() },(err)=>{
            if(err){
                return callback(err);
            }
            callback(undefined, ssi);
        });
    }

    generateGUID = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    }
}

let instance;
module.exports.getSharedStorage = function (dsuStorage) {
    if (typeof instance === 'undefined') {
        instance = new SharedStorage(dsuStorage);
        const promisifyFns = ["addSharedFile","cancelBatch","commitBatch","filter","getRecord","getSharedSSI","insertRecord","updateRecord"]
        for(let i = 0; i<promisifyFns.length; i++){
            let prop = promisifyFns[i];
            if(typeof instance[prop] ==="function"){
                instance[prop] = $$.promisify(instance[prop].bind(instance));
            }
        }
    }
    return instance;
}
},{"opendsu":false}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DPService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

// NOTE that DP stands for Dynamic Permission
class DPService extends DSUService {

    constructor() {
        super('/dynamic-permision');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    saveDP(dp, callback) {
        this.saveEntity(dp, callback);
    }

    updateDP(dp, callback) {
        this.updateEntity(dp, callback);
    }

    getDPs(callback) {
        this.getEntities(callback);
    }

}

let instance = null

const getDPService = () => {
    if (!instance) {
        instance = new DPService()
    }
    return instance
}

module.exports = {
    getDPService
};
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DeviceAssignationService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class DeviceAssignationService extends DSUService {

    constructor() {
        super('/assigned-devices');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getAssignedDevices = (callback) => this.getEntities(callback);

    assignDevice = (data, callback) => this.saveEntity(data, callback);

    updateAssignedDevice = (data, callback) => this.updateEntity(data, callback);

}

module.exports = DeviceAssignationService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DeviceServices.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class DeviceServices extends DSUService {

    constructor() {
        super('/device');
    }

    mountDevice = (keySSI, callback) => this.mountEntity(keySSI, callback);

    searchDevice(callback) {
        this.getEntities((err, devices) => {
            if (err) {
                return callback(err)
            }
            callback(err, devices)
        })
    }  

    saveDevice(device, callback) {
        this.saveEntity(device, callback);
    }

    updateDevice(device, callback) {
        this.updateEntity(device, callback);
    }

    deleteDevice(device, callback) {
        console.log("delete device WIP!")
    }
}

module.exports = DeviceServices;

},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\EvidenceService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class EvidenceService extends DSUService {

    constructor() {
        super('/evidence');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getEvidences = (callback) => this.getEntities(callback);

    getEvidence = (uid, callback) => this.getEntity(uid, callback);

    saveEvidence = (data, callback) => this.saveEntity(data, callback);

    updateEvidence = (data, callback) => this.updateEntity(data, callback);

}

module.exports = EvidenceService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\HealthDataService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class HealthDataService extends DSUService {

    constructor() {
        super('/health-data');
    }

    mountObservation = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getAllObservations = (callback) => this.getEntities(callback);

    getObservation = (uid, callback) => this.getEntity(uid, callback);

    saveObservation = (data, callback) => {
        const observations = {
            observations: data
        }
        this.saveEntity(observations, callback);
    }

    getSReadSSI = (pathPrefix, callback) => this.getEntityMountSSI(pathPrefix, callback);

}

module.exports = HealthDataService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\PermissionedHealthDataService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class PermissionedHealthDataService extends DSUService {

    constructor() {
        super('/permissioned-health-data');
    }

    mountObservation = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getAllObservations = (callback) => this.getEntities(callback);

    getObservation = (uid, callback) => this.getEntity(uid, callback);

    saveObservation = (data, callback) => this.saveEntity(data, callback);
    
}

module.exports = PermissionedHealthDataService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\QuestionnaireService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class QuestionnaireService extends DSUService {

    constructor() {
        super('/questionnaires');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getAllQuestionnaires = (callback) => this.getEntities(callback);

    getQuestionnaire = (uid, callback) => this.getEntity(uid, callback);

    saveQuestionnaire = (data, callback) => this.saveEntity(data, callback);

    updateQuestionnaire = (data, callback) => this.updateEntity(data, callback);

    getQuestionnaireSReadSSI = (questionnaire, callback) => {
        this.getEntityMountSSI("questionnaires", questionnaire.uid, (err, ssi) => {
            if(err){
                return callback(err);
            }
            const sReadSSI = this.getSReadSSI(ssi);
            callback(undefined, sReadSSI);
        });
    }
}

module.exports = QuestionnaireService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\ResponsesService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class ResponsesService extends DSUService {

    constructor() {
        super('/responses');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback)

    saveResponse = (response, callback) => this.saveEntity(response, callback)

    getResponses = (callback) => this.getEntities(callback);

}

module.exports = ResponsesService;

},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\StudiesService.js":[function(require,module,exports){
const DSUService = require("../DSUService");
const StudyNotesService = require('./StudyNotesService.js');


class StudiesService extends DSUService {

    constructor() {
        super('/studies');
        this.StudyNotesService = new StudyNotesService();
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getStudies = (callback) => this.getEntities(callback);

    getStudy = (uid, callback) => this.getEntity(uid, callback);

    saveStudy = (data, callback) => this.saveEntity(data, callback);

    updateStudy = (data, note, callback) => {
        if (typeof callback !== "function") {
            callback = note;
            note = undefined;
        }

        this.updateEntity(data, (err, studyEntity) => {
            if (err) {
                return callback(err);
            }
            if (note) {
                return this.StudyNotesService.saveNote(note, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(undefined, studyEntity)
                });
            }
            callback(undefined, studyEntity);
        });
    }

}

module.exports = StudiesService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js","./StudyNotesService.js":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\StudyNotesService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\StudyNotesService.js":[function(require,module,exports){
const DSUService = require("../DSUService");

class StudyNotesService extends DSUService {

    constructor() {
        super('/notes');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getNotes = (callback) => this.getEntities(callback);

    saveNote = (data, callback) => this.saveEntity(data, callback);

}

module.exports = StudyNotesService;
},{"../DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\Constants.js":[function(require,module,exports){
const MESSAGES = {

    HCO: {
        ADD_TRIAL : 'add-trial',
        ADD_CONSENT_VERSION: 'add-econsent-version',
        ADD_CONSENT : 'add-site-consent',
        DELETE_TRIAL : 'delete-trial',
        UPDATE_ECOSENT : 'update-econsent',
        SITE_STATUS_CHANGED: 'site-status-change',
        UPDATE_BASE_PROCEDURES: 'update-base-procedures',
        ADD_SITE : 'add-site',
        ADD_TRIAl_CONSENT : 'add-trial-consent',
        ADD_PATIENT_TO_TRIAL: 'add-to-trial',
        // NEW MESSAGES
        SEND_HCO_DSU_TO_PATIENT: 'send_hco_dsu_to_patient',
        SEND_HCO_DSU_TO_SPONSOR: 'send-hco-dsu-to-sponsor',
        SEND_REFRESH_CONSENTS_TO_PATIENT: 'send_refresh_consents',
        CLINICAL_SITE_QUESTIONNAIRE: 'clinical_site_questionnaire',
        UPDATE_STATUS: 'update_status',
        VISIT_SCHEDULED: 'schedule_visit',
        VISIT_CONFIRMED: 'visit_confirmed',
        NEW_HEALTHDATA: "new_healthdata",


        COMMUNICATION: {
            SPONSOR: {
                SIGN_ECONSENT: 'HCO signed econsent',
                DECLINE_ECONSENT: 'HCO declined econsent',
                VISIT_CONFIRMED: 'HCO confirmed a visit'
            },
            PATIENT: {
                ADD_TO_TRIAL: 'You were added to trial',
                SCHEDULE_VISIT: 'A visit was scheduled.',
                VISIT_DECLINED: 'A visit was declined by the patient',
                VISIT_ACCEPTED: 'A visit was accepted by the patient',
                VISIT_RESCHEDULED: 'A visit was rescheduled by the patient',
            },
            TYPE: {
                ADD_TO_TRIAL: 'add-to-trial',
                SCHEDULE_VISIT: 'schedule_visit',
                UPDATE_TP_NUMBER: 'update-tpNumber',
                UPDATE_VISIT: 'update_visit',
                VISIT_RESPONSE: 'visit-response',
                VISIT_CONFIRMED: 'visit_confirmed',

            }
        },
        FEEDBACK: {
            SUCCESS: {
                ADD_TRIAL_PARTICIPANT: 'Trial participant added successfully!'
            },
            ERROR: {
                ADD_TRIAL_PARTICIPANT: 'ERROR: There was an issue creating the trial participant'
            }
        }
    },

    PATIENT: {
        ADD_TO_TRIAL: 'add-to-trial',
        ADD_TRIAL_SUBJECT: 'add-trial-subject',
        SCHEDULE_VISIT: 'schedule-visit',
        UPDATE_TP_NUMBER: 'update_tpNumber',
        UPDATE_VISIT: 'update_visit',
        VISIT_RESPONSE: 'visit-response',
        VISIT_CONFIRMED: 'visit-confirmed',
        CREATE_DP: 'create_dp',
        TP_IS_UNAVAILABLE:"tp-is-unavailable",
        SEND_TRIAL_CONSENT_DSU_TO_HCO: 'send-trial-consent-to-hco',
    },

    SPONSOR :{
        SIGN_ECOSENT : 'sign-econsent',
        DECLINE_ECOSENT : 'decline-econsent',
        ADD_CONSENT_VERSION:"add-econsent-version",
        UPDATE_ECOSENT: 'update-econsent',
        UPDATE_SITE_STATUS: 'update-site-status',
        UPDATE_SITE: 'update-site',
        TP_ADDED:"tp-added",
        TP_CONSENT_UPDATE:"tp-consent-update",
        ADDED_TS_NUMBER:"added-ts-number"
    },

    RESEARCHER: {
        NEW_FEEDBACK: 'new_feedback',
        NEW_EVIDENCE:"new_evidence",
    }

}

const ECO_STATUSES = {
    TO_BE_SIGNED: 'Acknowledgement required',
    WITHDRAW: 'TP Withdrawed',
    CONTACT: 'Reconsent required',
    DECLINED: 'TP Declined',
    DECLINED_OPTIONAL: 'TP Declined Optional'
}

const PATIENT_NOTIFICATIONS_TYPE = {
    NEW_TRIAL : {
        notificationTitle:"New trial",
        tagPage:"trial",
    },
    NEW_VISIT : {
        notificationTitle:"New visit received",
        tagPage:"task-calendar",
    },
    VISIT_UPDATE : {
        notificationTitle:"Visit updated",
        tagPage:"task-calendar",
    },
    NEW_FEEDBACK : {
        notificationTitle:"New feedback",
        tagPage:"completed-studies",
    },
    NEW_EVIDENCE : {
        notificationTitle:"New evidence",
        tagPage:"completed-studies",
    },
    NEW_STUDY : {
        notificationTitle:"New study",
        tagPage:"completed-studies",
    },
    NEW_HEALTHDATA : {
        notificationTitle:"New health data available",
        tagPage:"iot-data-selection",
    },
    DEVICE_ASSIGNED:{
        notificationTitle:"A new device was assigned to yourself",
        tagPage:"iot-data-selection",
    },
    DEVICE_UNASSIGNED:{
        notificationTitle:"A device was unassigned from yourself",
        tagPage:"iot-data-selection",
    },
    NEW_INVITATION : {
        notificationTitle:"New research study invitation",
        tagPage:"iot-health-studies",
    },
    NEW_TPNUMBER : {
        notificationTitle:"TP number was assigned for yourself",
        tagPage:"trial",
    },
    NEW_CONSENTS: {
        notificationTitle :"New Consents",
        tagPage:"trial",
    },
    UPDATE_STATUS: {
        notificationTitle :"Tp status updated",
        tagPage:"trial",
    },
    VISIT_CONFIRMED: {
        notificationTitle :"HCO confirmed a visit",
        tagPage:"task-calendar",
    },
    VISIT_DETAILS_UPDATED : {
        notificationTitle :"Visit details updated!",
        tagPage:"task-calendar"
    },
    CLINICAL_SITE_QUESTIONNAIRE: {
        notificationTitle :"Received a new questionnaire",
        tagPage:"task-calendar",
    }
}

const HCO_NOTIFICATIONS_TYPE = {
    TRIAL_UPDATES : {
        notificationTitle:"Trial Updates",
    },
    WITHDRAWS : {
        notificationTitle:"Withdraws",
    },
    CONSENT_UPDATES : {
        notificationTitle:"Consent Updates",
    },
    MILESTONES_REMINDERS : {
        notificationTitle:"Milestones Reminders",
    },
    TRIAL_SUBJECT_QUESTIONNAIRE_RESPONSES : {
        notificationTitle: "Patient questionnaire response",
    },
}


const TRIAL_PARTICIPANT_STATUS = {
    ENROLLED: 'Enrolled',
    WITHDRAW: 'Withdrawed',
    DECLINED: 'Declined',
    TP_WITHDRAWN: 'Withdraw Intention',
    SCREENED: 'Screened',
    PLANNED: 'Planned',
    END_OF_TREATMENT: "End Of Treatment",
    COMPLETED: "Completed",
    DISCONTINUED: "Discontinued",
    SCREEN_FAILED: "Screen Failed",
    UNAVAILABLE:"Unavailable",
    WITHDRAWN: 'Withdrawn',
}

const TP_ACTIONNEEDED_NOTIFICATIONS = {
    SET_TP_NUMBER: 'tp-number-set',
    TP_VISIT_CONFIRMED: 'tp-visit-confirmed',
    TP_VISIT_RESCHEDULED: "visit-rescheduled",
    VISIT_CONFIRMED: 'visit-confirmed',
    TP_WITHDRAWN: 'Tp Withdrawn',
    TP_DECLINED: 'TP Declined',
    TP_DECLINED_OPTIONAL: 'TP Declined Optional'
}

const QUESTION_TYPES = {
    FREE_TEXT:"string",
    SLIDER:"slider",
    CHECKBOX:"checkbox"
}

const HCO_STAGE_STATUS = {
    ENROLLING: 'Enrolling'
}

const DATE_UTILS = {
    FORMATS: {
        YearMonthDayPattern: "YYYY-MM-DD",
        YMDDateTimeFormatPattern: 'YYYY-MM-DD',
        HourFormatPattern: "HH:mm",
        DateTimeFormatPattern: 'DD-MMM-YYYY, HH:mm',
        YearMonthPattern:  'YYYY-MM',
    }
}

const RECRUITING_STAGES = {
    NOT_YET_RECRUITING: "Not yet recruiting",
    RECRUITING: "Recruiting",
    ACTIVE_NOT_RECRUITING: "Active, not recruiting"
}

module.exports = {
    DATE_UTILS,
    MESSAGES,
    ECO_STATUSES,
    TRIAL_PARTICIPANT_STATUS,
    HCO_STAGE_STATUS,
    HCO_NOTIFICATIONS_TYPE,
    PATIENT_NOTIFICATIONS_TYPE,
    TP_ACTIONNEEDED_NOTIFICATIONS,
    QUESTION_TYPES,
    RECRUITING_STAGES
};
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\FileDownloader.js":[function(require,module,exports){
class FileDownloader {

    constructor(path, fileName) {
        console.warn("Obsolete. use FileDownloaderService in order to avoid using sw when downloading/uploading files")
        this.path = path;
        this.fileName = fileName;

        if (this.path === '/') {
            this.path = '';
        }
    }

    downloadFile(callback) {
        if (!callback || typeof callback !== 'function') {
            callback = this.downloadFileToDevice;
        }

        this._getFileBlob(this.path, this.fileName, callback);
    }

    /**
     * @param {Object{ contentType: string, rawBlob: Blob }
     */
    downloadFileToDevice = (downloadedFile) => {
        window.URL = window.URL || window.webkitURL;
        let blob = downloadedFile.rawBlob;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.fileName;
        link.click();
    }

    _getFileBlob(path, fileName, callback) {
        let url = `/download${path}`;
        if (!path.includes(fileName)) {
            url += `/${fileName}`;
        }

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    response.blob().then((blob) => {
                        callback({
                            contentType: response.headers.get('Content-Type') || '',
                            rawBlob: blob
                        });
                    });
                } else {
                    console.error(`Error on download file ${path}/${fileName}: `, response);
                }
            });
    }
}

module.exports = FileDownloader
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\FileDownloaderService.js":[function(require,module,exports){
const DSUService = require('../services/DSUService.js');

module.exports = class FileDownloaderService extends DSUService {
    files = [];

    constructor(DSUStorage) {
        super(DSUStorage);
        this.DSUStorage = DSUStorage;
    }

    async prepareDownloadFromDsu(path, filename) {
        return new Promise(async (resolve) => {
            let file = this.files.find((x) => x.filename === filename);
            if (!file) {
                file = {
                    path: path === '/' ? '' : path,
                    filename,
                };
                this.files.push(file);

                await this._getFileBlob(file.path, file.filename);
                resolve();
            } else resolve();
        });
    }

    getFileBlob(filename) {
        const downloadedFile = this.files.find((x) => x.filename === filename);
        if (!downloadedFile) {
            console.error("File blob was not retrieved yet");
        }
        return downloadedFile;
    }

    prepareDownloadFromBrowser(file) {
        return new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = (e) => {
                let blob = new Blob([new Uint8Array(e.target.result)], { type: file.type });
                this.files.push({
                    filename: file.name,
                    rawBlob: blob,
                    mimeType: blob.type,
                });
                resolve();
            };
            reader.readAsArrayBuffer(file);
        });
    }

    downloadFileToDevice = (filename) => {
        const downloadedFile = this.files.find((x) => x.filename === filename);
        window.URL = window.URL || window.webkitURL;
        let blob = downloadedFile.rawBlob;

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    async _getFileBlob(path, filename) {
        const file = this.files.find((x) => x.filename === filename);
        const buffer = await this.readFileAsync(path + '/' + filename);
        const blob = new Blob([buffer]);
        file['rawBlob'] = blob;
        file['mimeType'] = blob.type;
        return;
    }
};

},{"../services/DSUService.js":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js"}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\HeaderController.js":[function(require,module,exports){
(function () {
    if(typeof document === "undefined"){
        return;
    }
    const helpButton = document.querySelector("button[data-tag=\"header:help\"]");
    const logoutButton = document.querySelector("button[data-tag=\"header:logout\"]");
    console.log("buttons", helpButton, logoutButton);
    if (helpButton) {
        helpButton.addEventListener("click", () => {
            console.log("Help pressed!");
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            let iframeIdentity;
            if (window.frameElement) {
                iframeIdentity = window.frameElement.getAttribute('identity');

                if (!iframeIdentity) {
                    throw new Error("App was not loaded from a wallet loader")
                }

                window.parent.document.dispatchEvent(new CustomEvent(iframeIdentity, {
                    detail: {status: "sign-out"}
                }));
            }
        });
    }
})();

},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\fetch.js":[function(require,module,exports){
function executeFetch(url, options) {
  // check if we need to add the BASE_URL to the prefix of the url
  if ($$.SSAPP_CONTEXT && $$.SSAPP_CONTEXT.BASE_URL && $$.SSAPP_CONTEXT.SEED && url.indexOf($$.SSAPP_CONTEXT.BASE_URL) !== 0) {
    // BASE_URL ends with / so make sure that url doesn't already start with /
    url = `${$$.SSAPP_CONTEXT.BASE_URL}${url.indexOf('/') === 0 ? url.substr(1) : url}`;
  }

  return fetch(url, options);
}

module.exports = executeFetch;
},{}],"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\moment.min.js":[function(require,module,exports){
/**
 * Minified by jsDelivr using Terser v5.3.0.
 * Original file: /npm/moment@2.29.1/moment.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
//! moment.js
//! version : 2.29.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,(function(){"use strict";var e,t;function n(){return e.apply(null,arguments)}function s(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function i(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function r(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function a(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(r(e,t))return!1;return!0}function o(e){return void 0===e}function u(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function l(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function h(e,t){var n,s=[];for(n=0;n<e.length;++n)s.push(t(e[n],n));return s}function d(e,t){for(var n in t)r(t,n)&&(e[n]=t[n]);return r(t,"toString")&&(e.toString=t.toString),r(t,"valueOf")&&(e.valueOf=t.valueOf),e}function c(e,t,n,s){return Dt(e,t,n,s,!0).utc()}function f(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidEra:null,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],era:null,meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function m(e){if(null==e._isValid){var n=f(e),s=t.call(n.parsedDateParts,(function(e){return null!=e})),i=!isNaN(e._d.getTime())&&n.overflow<0&&!n.empty&&!n.invalidEra&&!n.invalidMonth&&!n.invalidWeekday&&!n.weekdayMismatch&&!n.nullInput&&!n.invalidFormat&&!n.userInvalidated&&(!n.meridiem||n.meridiem&&s);if(e._strict&&(i=i&&0===n.charsLeftOver&&0===n.unusedTokens.length&&void 0===n.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return i;e._isValid=i}return e._isValid}function _(e){var t=c(NaN);return null!=e?d(f(t),e):f(t).userInvalidated=!0,t}t=Array.prototype.some?Array.prototype.some:function(e){var t,n=Object(this),s=n.length>>>0;for(t=0;t<s;t++)if(t in n&&e.call(this,n[t],t,n))return!0;return!1};var y=n.momentProperties=[],g=!1;function w(e,t){var n,s,i;if(o(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),o(t._i)||(e._i=t._i),o(t._f)||(e._f=t._f),o(t._l)||(e._l=t._l),o(t._strict)||(e._strict=t._strict),o(t._tzm)||(e._tzm=t._tzm),o(t._isUTC)||(e._isUTC=t._isUTC),o(t._offset)||(e._offset=t._offset),o(t._pf)||(e._pf=f(t)),o(t._locale)||(e._locale=t._locale),y.length>0)for(n=0;n<y.length;n++)o(i=t[s=y[n]])||(e[s]=i);return e}function p(e){w(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===g&&(g=!0,n.updateOffset(this),g=!1)}function v(e){return e instanceof p||null!=e&&null!=e._isAMomentObject}function k(e){!1===n.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function M(e,t){var s=!0;return d((function(){if(null!=n.deprecationHandler&&n.deprecationHandler(null,e),s){var i,a,o,u=[];for(a=0;a<arguments.length;a++){if(i="","object"==typeof arguments[a]){for(o in i+="\n["+a+"] ",arguments[0])r(arguments[0],o)&&(i+=o+": "+arguments[0][o]+", ");i=i.slice(0,-2)}else i=arguments[a];u.push(i)}k(e+"\nArguments: "+Array.prototype.slice.call(u).join("")+"\n"+(new Error).stack),s=!1}return t.apply(this,arguments)}),t)}var D,S={};function Y(e,t){null!=n.deprecationHandler&&n.deprecationHandler(e,t),S[e]||(k(t),S[e]=!0)}function O(e){return"undefined"!=typeof Function&&e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function b(e,t){var n,s=d({},e);for(n in t)r(t,n)&&(i(e[n])&&i(t[n])?(s[n]={},d(s[n],e[n]),d(s[n],t[n])):null!=t[n]?s[n]=t[n]:delete s[n]);for(n in e)r(e,n)&&!r(t,n)&&i(e[n])&&(s[n]=d({},s[n]));return s}function x(e){null!=e&&this.set(e)}n.suppressDeprecationWarnings=!1,n.deprecationHandler=null,D=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)r(e,t)&&n.push(t);return n};function T(e,t,n){var s=""+Math.abs(e),i=t-s.length;return(e>=0?n?"+":"":"-")+Math.pow(10,Math.max(0,i)).toString().substr(1)+s}var N=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,P=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,R={},W={};function C(e,t,n,s){var i=s;"string"==typeof s&&(i=function(){return this[s]()}),e&&(W[e]=i),t&&(W[t[0]]=function(){return T(i.apply(this,arguments),t[1],t[2])}),n&&(W[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function H(e,t){return e.isValid()?(t=U(t,e.localeData()),R[t]=R[t]||function(e){var t,n,s,i=e.match(N);for(t=0,n=i.length;t<n;t++)W[i[t]]?i[t]=W[i[t]]:i[t]=(s=i[t]).match(/\[[\s\S]/)?s.replace(/^\[|\]$/g,""):s.replace(/\\/g,"");return function(t){var s,r="";for(s=0;s<n;s++)r+=O(i[s])?i[s].call(t,e):i[s];return r}}(t),R[t](e)):e.localeData().invalidDate()}function U(e,t){var n=5;function s(e){return t.longDateFormat(e)||e}for(P.lastIndex=0;n>=0&&P.test(e);)e=e.replace(P,s),P.lastIndex=0,n-=1;return e}var F={};function L(e,t){var n=e.toLowerCase();F[n]=F[n+"s"]=F[t]=e}function V(e){return"string"==typeof e?F[e]||F[e.toLowerCase()]:void 0}function G(e){var t,n,s={};for(n in e)r(e,n)&&(t=V(n))&&(s[t]=e[n]);return s}var E={};function A(e,t){E[e]=t}function j(e){return e%4==0&&e%100!=0||e%400==0}function I(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function Z(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=I(t)),n}function z(e,t){return function(s){return null!=s?(q(this,e,s),n.updateOffset(this,t),this):$(this,e)}}function $(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function q(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&j(e.year())&&1===e.month()&&29===e.date()?(n=Z(n),e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),ve(n,e.month()))):e._d["set"+(e._isUTC?"UTC":"")+t](n))}var B,J=/\d/,Q=/\d\d/,X=/\d{3}/,K=/\d{4}/,ee=/[+-]?\d{6}/,te=/\d\d?/,ne=/\d\d\d\d?/,se=/\d\d\d\d\d\d?/,ie=/\d{1,3}/,re=/\d{1,4}/,ae=/[+-]?\d{1,6}/,oe=/\d+/,ue=/[+-]?\d+/,le=/Z|[+-]\d\d:?\d\d/gi,he=/Z|[+-]\d\d(?::?\d\d)?/gi,de=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;function ce(e,t,n){B[e]=O(t)?t:function(e,s){return e&&n?n:t}}function fe(e,t){return r(B,e)?B[e](t._strict,t._locale):new RegExp(me(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,(function(e,t,n,s,i){return t||n||s||i}))))}function me(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}B={};var _e={};function ye(e,t){var n,s=t;for("string"==typeof e&&(e=[e]),u(t)&&(s=function(e,n){n[t]=Z(e)}),n=0;n<e.length;n++)_e[e[n]]=s}function ge(e,t){ye(e,(function(e,n,s,i){s._w=s._w||{},t(e,s._w,s,i)}))}function we(e,t,n){null!=t&&r(_e,e)&&_e[e](t,n._a,n,e)}var pe;function ve(e,t){if(isNaN(e)||isNaN(t))return NaN;var n,s=(t%(n=12)+n)%n;return e+=(t-s)/12,1===s?j(e)?29:28:31-s%7%2}pe=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},C("M",["MM",2],"Mo",(function(){return this.month()+1})),C("MMM",0,0,(function(e){return this.localeData().monthsShort(this,e)})),C("MMMM",0,0,(function(e){return this.localeData().months(this,e)})),L("month","M"),A("month",8),ce("M",te),ce("MM",te,Q),ce("MMM",(function(e,t){return t.monthsShortRegex(e)})),ce("MMMM",(function(e,t){return t.monthsRegex(e)})),ye(["M","MM"],(function(e,t){t[1]=Z(e)-1})),ye(["MMM","MMMM"],(function(e,t,n,s){var i=n._locale.monthsParse(e,s,n._strict);null!=i?t[1]=i:f(n).invalidMonth=e}));var ke="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Me="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),De=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Se=de,Ye=de;function Oe(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=c([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(i=pe.call(this._shortMonthsParse,a))?i:null:-1!==(i=pe.call(this._longMonthsParse,a))?i:null:"MMM"===t?-1!==(i=pe.call(this._shortMonthsParse,a))||-1!==(i=pe.call(this._longMonthsParse,a))?i:null:-1!==(i=pe.call(this._longMonthsParse,a))||-1!==(i=pe.call(this._shortMonthsParse,a))?i:null}function be(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=Z(t);else if(!u(t=e.localeData().monthsParse(t)))return e;return n=Math.min(e.date(),ve(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function xe(e){return null!=e?(be(this,e),n.updateOffset(this,!0),this):$(this,"Month")}function Te(){function e(e,t){return t.length-e.length}var t,n,s=[],i=[],r=[];for(t=0;t<12;t++)n=c([2e3,t]),s.push(this.monthsShort(n,"")),i.push(this.months(n,"")),r.push(this.months(n,"")),r.push(this.monthsShort(n,""));for(s.sort(e),i.sort(e),r.sort(e),t=0;t<12;t++)s[t]=me(s[t]),i[t]=me(i[t]);for(t=0;t<24;t++)r[t]=me(r[t]);this._monthsRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+s.join("|")+")","i")}function Ne(e){return j(e)?366:365}C("Y",0,0,(function(){var e=this.year();return e<=9999?T(e,4):"+"+e})),C(0,["YY",2],0,(function(){return this.year()%100})),C(0,["YYYY",4],0,"year"),C(0,["YYYYY",5],0,"year"),C(0,["YYYYYY",6,!0],0,"year"),L("year","y"),A("year",1),ce("Y",ue),ce("YY",te,Q),ce("YYYY",re,K),ce("YYYYY",ae,ee),ce("YYYYYY",ae,ee),ye(["YYYYY","YYYYYY"],0),ye("YYYY",(function(e,t){t[0]=2===e.length?n.parseTwoDigitYear(e):Z(e)})),ye("YY",(function(e,t){t[0]=n.parseTwoDigitYear(e)})),ye("Y",(function(e,t){t[0]=parseInt(e,10)})),n.parseTwoDigitYear=function(e){return Z(e)+(Z(e)>68?1900:2e3)};var Pe=z("FullYear",!0);function Re(e,t,n,s,i,r,a){var o;return e<100&&e>=0?(o=new Date(e+400,t,n,s,i,r,a),isFinite(o.getFullYear())&&o.setFullYear(e)):o=new Date(e,t,n,s,i,r,a),o}function We(e){var t,n;return e<100&&e>=0?((n=Array.prototype.slice.call(arguments))[0]=e+400,t=new Date(Date.UTC.apply(null,n)),isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e)):t=new Date(Date.UTC.apply(null,arguments)),t}function Ce(e,t,n){var s=7+t-n;return-((7+We(e,0,s).getUTCDay()-t)%7)+s-1}function He(e,t,n,s,i){var r,a,o=1+7*(t-1)+(7+n-s)%7+Ce(e,s,i);return o<=0?a=Ne(r=e-1)+o:o>Ne(e)?(r=e+1,a=o-Ne(e)):(r=e,a=o),{year:r,dayOfYear:a}}function Ue(e,t,n){var s,i,r=Ce(e.year(),t,n),a=Math.floor((e.dayOfYear()-r-1)/7)+1;return a<1?s=a+Fe(i=e.year()-1,t,n):a>Fe(e.year(),t,n)?(s=a-Fe(e.year(),t,n),i=e.year()+1):(i=e.year(),s=a),{week:s,year:i}}function Fe(e,t,n){var s=Ce(e,t,n),i=Ce(e+1,t,n);return(Ne(e)-s+i)/7}C("w",["ww",2],"wo","week"),C("W",["WW",2],"Wo","isoWeek"),L("week","w"),L("isoWeek","W"),A("week",5),A("isoWeek",5),ce("w",te),ce("ww",te,Q),ce("W",te),ce("WW",te,Q),ge(["w","ww","W","WW"],(function(e,t,n,s){t[s.substr(0,1)]=Z(e)}));function Le(e,t){return e.slice(t,7).concat(e.slice(0,t))}C("d",0,"do","day"),C("dd",0,0,(function(e){return this.localeData().weekdaysMin(this,e)})),C("ddd",0,0,(function(e){return this.localeData().weekdaysShort(this,e)})),C("dddd",0,0,(function(e){return this.localeData().weekdays(this,e)})),C("e",0,0,"weekday"),C("E",0,0,"isoWeekday"),L("day","d"),L("weekday","e"),L("isoWeekday","E"),A("day",11),A("weekday",11),A("isoWeekday",11),ce("d",te),ce("e",te),ce("E",te),ce("dd",(function(e,t){return t.weekdaysMinRegex(e)})),ce("ddd",(function(e,t){return t.weekdaysShortRegex(e)})),ce("dddd",(function(e,t){return t.weekdaysRegex(e)})),ge(["dd","ddd","dddd"],(function(e,t,n,s){var i=n._locale.weekdaysParse(e,s,n._strict);null!=i?t.d=i:f(n).invalidWeekday=e})),ge(["d","e","E"],(function(e,t,n,s){t[s]=Z(e)}));var Ve="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Ge="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Ee="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),Ae=de,je=de,Ie=de;function Ze(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=c([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(i=pe.call(this._weekdaysParse,a))?i:null:"ddd"===t?-1!==(i=pe.call(this._shortWeekdaysParse,a))?i:null:-1!==(i=pe.call(this._minWeekdaysParse,a))?i:null:"dddd"===t?-1!==(i=pe.call(this._weekdaysParse,a))||-1!==(i=pe.call(this._shortWeekdaysParse,a))||-1!==(i=pe.call(this._minWeekdaysParse,a))?i:null:"ddd"===t?-1!==(i=pe.call(this._shortWeekdaysParse,a))||-1!==(i=pe.call(this._weekdaysParse,a))||-1!==(i=pe.call(this._minWeekdaysParse,a))?i:null:-1!==(i=pe.call(this._minWeekdaysParse,a))||-1!==(i=pe.call(this._weekdaysParse,a))||-1!==(i=pe.call(this._shortWeekdaysParse,a))?i:null}function ze(){function e(e,t){return t.length-e.length}var t,n,s,i,r,a=[],o=[],u=[],l=[];for(t=0;t<7;t++)n=c([2e3,1]).day(t),s=me(this.weekdaysMin(n,"")),i=me(this.weekdaysShort(n,"")),r=me(this.weekdays(n,"")),a.push(s),o.push(i),u.push(r),l.push(s),l.push(i),l.push(r);a.sort(e),o.sort(e),u.sort(e),l.sort(e),this._weekdaysRegex=new RegExp("^("+l.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+u.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+a.join("|")+")","i")}function $e(){return this.hours()%12||12}function qe(e,t){C(e,0,0,(function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)}))}function Be(e,t){return t._meridiemParse}C("H",["HH",2],0,"hour"),C("h",["hh",2],0,$e),C("k",["kk",2],0,(function(){return this.hours()||24})),C("hmm",0,0,(function(){return""+$e.apply(this)+T(this.minutes(),2)})),C("hmmss",0,0,(function(){return""+$e.apply(this)+T(this.minutes(),2)+T(this.seconds(),2)})),C("Hmm",0,0,(function(){return""+this.hours()+T(this.minutes(),2)})),C("Hmmss",0,0,(function(){return""+this.hours()+T(this.minutes(),2)+T(this.seconds(),2)})),qe("a",!0),qe("A",!1),L("hour","h"),A("hour",13),ce("a",Be),ce("A",Be),ce("H",te),ce("h",te),ce("k",te),ce("HH",te,Q),ce("hh",te,Q),ce("kk",te,Q),ce("hmm",ne),ce("hmmss",se),ce("Hmm",ne),ce("Hmmss",se),ye(["H","HH"],3),ye(["k","kk"],(function(e,t,n){var s=Z(e);t[3]=24===s?0:s})),ye(["a","A"],(function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e})),ye(["h","hh"],(function(e,t,n){t[3]=Z(e),f(n).bigHour=!0})),ye("hmm",(function(e,t,n){var s=e.length-2;t[3]=Z(e.substr(0,s)),t[4]=Z(e.substr(s)),f(n).bigHour=!0})),ye("hmmss",(function(e,t,n){var s=e.length-4,i=e.length-2;t[3]=Z(e.substr(0,s)),t[4]=Z(e.substr(s,2)),t[5]=Z(e.substr(i)),f(n).bigHour=!0})),ye("Hmm",(function(e,t,n){var s=e.length-2;t[3]=Z(e.substr(0,s)),t[4]=Z(e.substr(s))})),ye("Hmmss",(function(e,t,n){var s=e.length-4,i=e.length-2;t[3]=Z(e.substr(0,s)),t[4]=Z(e.substr(s,2)),t[5]=Z(e.substr(i))}));var Je=z("Hours",!0);var Qe,Xe={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",w:"a week",ww:"%d weeks",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:ke,monthsShort:Me,week:{dow:0,doy:6},weekdays:Ve,weekdaysMin:Ee,weekdaysShort:Ge,meridiemParse:/[ap]\.?m?\.?/i},Ke={},et={};function tt(e,t){var n,s=Math.min(e.length,t.length);for(n=0;n<s;n+=1)if(e[n]!==t[n])return n;return s}function nt(e){return e?e.toLowerCase().replace("_","-"):e}function st(e){var t=null;if(void 0===Ke[e]&&"undefined"!=typeof module&&module&&module.exports)try{t=Qe._abbr,require("./locale/"+e),it(t)}catch(t){Ke[e]=null}return Ke[e]}function it(e,t){var n;return e&&((n=o(t)?at(e):rt(e,t))?Qe=n:"undefined"!=typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),Qe._abbr}function rt(e,t){if(null!==t){var n,s=Xe;if(t.abbr=e,null!=Ke[e])Y("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),s=Ke[e]._config;else if(null!=t.parentLocale)if(null!=Ke[t.parentLocale])s=Ke[t.parentLocale]._config;else{if(null==(n=st(t.parentLocale)))return et[t.parentLocale]||(et[t.parentLocale]=[]),et[t.parentLocale].push({name:e,config:t}),null;s=n._config}return Ke[e]=new x(b(s,t)),et[e]&&et[e].forEach((function(e){rt(e.name,e.config)})),it(e),Ke[e]}return delete Ke[e],null}function at(e){var t;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return Qe;if(!s(e)){if(t=st(e))return t;e=[e]}return function(e){for(var t,n,s,i,r=0;r<e.length;){for(t=(i=nt(e[r]).split("-")).length,n=(n=nt(e[r+1]))?n.split("-"):null;t>0;){if(s=st(i.slice(0,t).join("-")))return s;if(n&&n.length>=t&&tt(i,n)>=t-1)break;t--}r++}return Qe}(e)}function ot(e){var t,n=e._a;return n&&-2===f(e).overflow&&(t=n[1]<0||n[1]>11?1:n[2]<1||n[2]>ve(n[0],n[1])?2:n[3]<0||n[3]>24||24===n[3]&&(0!==n[4]||0!==n[5]||0!==n[6])?3:n[4]<0||n[4]>59?4:n[5]<0||n[5]>59?5:n[6]<0||n[6]>999?6:-1,f(e)._overflowDayOfYear&&(t<0||t>2)&&(t=2),f(e)._overflowWeeks&&-1===t&&(t=7),f(e)._overflowWeekday&&-1===t&&(t=8),f(e).overflow=t),e}var ut=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,lt=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,ht=/Z|[+-]\d\d(?::?\d\d)?/,dt=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/],["YYYYMM",/\d{6}/,!1],["YYYY",/\d{4}/,!1]],ct=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],ft=/^\/?Date\((-?\d+)/i,mt=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,_t={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function yt(e){var t,n,s,i,r,a,o=e._i,u=ut.exec(o)||lt.exec(o);if(u){for(f(e).iso=!0,t=0,n=dt.length;t<n;t++)if(dt[t][1].exec(u[1])){i=dt[t][0],s=!1!==dt[t][2];break}if(null==i)return void(e._isValid=!1);if(u[3]){for(t=0,n=ct.length;t<n;t++)if(ct[t][1].exec(u[3])){r=(u[2]||" ")+ct[t][0];break}if(null==r)return void(e._isValid=!1)}if(!s&&null!=r)return void(e._isValid=!1);if(u[4]){if(!ht.exec(u[4]))return void(e._isValid=!1);a="Z"}e._f=i+(r||"")+(a||""),kt(e)}else e._isValid=!1}function gt(e){var t=parseInt(e,10);return t<=49?2e3+t:t<=999?1900+t:t}function wt(e){var t,n,s,i,r,a,o,u,l=mt.exec(e._i.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,""));if(l){if(n=l[4],s=l[3],i=l[2],r=l[5],a=l[6],o=l[7],u=[gt(n),Me.indexOf(s),parseInt(i,10),parseInt(r,10),parseInt(a,10)],o&&u.push(parseInt(o,10)),t=u,!function(e,t,n){return!e||Ge.indexOf(e)===new Date(t[0],t[1],t[2]).getDay()||(f(n).weekdayMismatch=!0,n._isValid=!1,!1)}(l[1],t,e))return;e._a=t,e._tzm=function(e,t,n){if(e)return _t[e];if(t)return 0;var s=parseInt(n,10),i=s%100;return(s-i)/100*60+i}(l[8],l[9],l[10]),e._d=We.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),f(e).rfc2822=!0}else e._isValid=!1}function pt(e,t,n){return null!=e?e:null!=t?t:n}function vt(e){var t,s,i,r,a,o=[];if(!e._d){for(i=function(e){var t=new Date(n.now());return e._useUTC?[t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()]:[t.getFullYear(),t.getMonth(),t.getDate()]}(e),e._w&&null==e._a[2]&&null==e._a[1]&&function(e){var t,n,s,i,r,a,o,u,l;null!=(t=e._w).GG||null!=t.W||null!=t.E?(r=1,a=4,n=pt(t.GG,e._a[0],Ue(St(),1,4).year),s=pt(t.W,1),((i=pt(t.E,1))<1||i>7)&&(u=!0)):(r=e._locale._week.dow,a=e._locale._week.doy,l=Ue(St(),r,a),n=pt(t.gg,e._a[0],l.year),s=pt(t.w,l.week),null!=t.d?((i=t.d)<0||i>6)&&(u=!0):null!=t.e?(i=t.e+r,(t.e<0||t.e>6)&&(u=!0)):i=r);s<1||s>Fe(n,r,a)?f(e)._overflowWeeks=!0:null!=u?f(e)._overflowWeekday=!0:(o=He(n,s,i,r,a),e._a[0]=o.year,e._dayOfYear=o.dayOfYear)}(e),null!=e._dayOfYear&&(a=pt(e._a[0],i[0]),(e._dayOfYear>Ne(a)||0===e._dayOfYear)&&(f(e)._overflowDayOfYear=!0),s=We(a,0,e._dayOfYear),e._a[1]=s.getUTCMonth(),e._a[2]=s.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=o[t]=i[t];for(;t<7;t++)e._a[t]=o[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[3]&&0===e._a[4]&&0===e._a[5]&&0===e._a[6]&&(e._nextDay=!0,e._a[3]=0),e._d=(e._useUTC?We:Re).apply(null,o),r=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[3]=24),e._w&&void 0!==e._w.d&&e._w.d!==r&&(f(e).weekdayMismatch=!0)}}function kt(e){if(e._f!==n.ISO_8601)if(e._f!==n.RFC_2822){e._a=[],f(e).empty=!0;var t,s,i,r,a,o,u=""+e._i,l=u.length,h=0;for(i=U(e._f,e._locale).match(N)||[],t=0;t<i.length;t++)r=i[t],(s=(u.match(fe(r,e))||[])[0])&&((a=u.substr(0,u.indexOf(s))).length>0&&f(e).unusedInput.push(a),u=u.slice(u.indexOf(s)+s.length),h+=s.length),W[r]?(s?f(e).empty=!1:f(e).unusedTokens.push(r),we(r,s,e)):e._strict&&!s&&f(e).unusedTokens.push(r);f(e).charsLeftOver=l-h,u.length>0&&f(e).unusedInput.push(u),e._a[3]<=12&&!0===f(e).bigHour&&e._a[3]>0&&(f(e).bigHour=void 0),f(e).parsedDateParts=e._a.slice(0),f(e).meridiem=e._meridiem,e._a[3]=function(e,t,n){var s;if(null==n)return t;return null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?((s=e.isPM(n))&&t<12&&(t+=12),s||12!==t||(t=0),t):t}(e._locale,e._a[3],e._meridiem),null!==(o=f(e).era)&&(e._a[0]=e._locale.erasConvertYear(o,e._a[0])),vt(e),ot(e)}else wt(e);else yt(e)}function Mt(e){var t=e._i,r=e._f;return e._locale=e._locale||at(e._l),null===t||void 0===r&&""===t?_({nullInput:!0}):("string"==typeof t&&(e._i=t=e._locale.preparse(t)),v(t)?new p(ot(t)):(l(t)?e._d=t:s(r)?function(e){var t,n,s,i,r,a,o=!1;if(0===e._f.length)return f(e).invalidFormat=!0,void(e._d=new Date(NaN));for(i=0;i<e._f.length;i++)r=0,a=!1,t=w({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],kt(t),m(t)&&(a=!0),r+=f(t).charsLeftOver,r+=10*f(t).unusedTokens.length,f(t).score=r,o?r<s&&(s=r,n=t):(null==s||r<s||a)&&(s=r,n=t,a&&(o=!0));d(e,n||t)}(e):r?kt(e):function(e){var t=e._i;o(t)?e._d=new Date(n.now()):l(t)?e._d=new Date(t.valueOf()):"string"==typeof t?function(e){var t=ft.exec(e._i);null===t?(yt(e),!1===e._isValid&&(delete e._isValid,wt(e),!1===e._isValid&&(delete e._isValid,e._strict?e._isValid=!1:n.createFromInputFallback(e)))):e._d=new Date(+t[1])}(e):s(t)?(e._a=h(t.slice(0),(function(e){return parseInt(e,10)})),vt(e)):i(t)?function(e){if(!e._d){var t=G(e._i),n=void 0===t.day?t.date:t.day;e._a=h([t.year,t.month,n,t.hour,t.minute,t.second,t.millisecond],(function(e){return e&&parseInt(e,10)})),vt(e)}}(e):u(t)?e._d=new Date(t):n.createFromInputFallback(e)}(e),m(e)||(e._d=null),e))}function Dt(e,t,n,r,o){var u,l={};return!0!==t&&!1!==t||(r=t,t=void 0),!0!==n&&!1!==n||(r=n,n=void 0),(i(e)&&a(e)||s(e)&&0===e.length)&&(e=void 0),l._isAMomentObject=!0,l._useUTC=l._isUTC=o,l._l=n,l._i=e,l._f=t,l._strict=r,(u=new p(ot(Mt(l))))._nextDay&&(u.add(1,"d"),u._nextDay=void 0),u}function St(e,t,n,s){return Dt(e,t,n,s,!1)}n.createFromInputFallback=M("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",(function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))})),n.ISO_8601=function(){},n.RFC_2822=function(){};var Yt=M("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=St.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:_()})),Ot=M("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",(function(){var e=St.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:_()}));function bt(e,t){var n,i;if(1===t.length&&s(t[0])&&(t=t[0]),!t.length)return St();for(n=t[0],i=1;i<t.length;++i)t[i].isValid()&&!t[i][e](n)||(n=t[i]);return n}var xt=["year","quarter","month","week","day","hour","minute","second","millisecond"];function Tt(e){var t=G(e),n=t.year||0,s=t.quarter||0,i=t.month||0,a=t.week||t.isoWeek||0,o=t.day||0,u=t.hour||0,l=t.minute||0,h=t.second||0,d=t.millisecond||0;this._isValid=function(e){var t,n,s=!1;for(t in e)if(r(e,t)&&(-1===pe.call(xt,t)||null!=e[t]&&isNaN(e[t])))return!1;for(n=0;n<xt.length;++n)if(e[xt[n]]){if(s)return!1;parseFloat(e[xt[n]])!==Z(e[xt[n]])&&(s=!0)}return!0}(t),this._milliseconds=+d+1e3*h+6e4*l+1e3*u*60*60,this._days=+o+7*a,this._months=+i+3*s+12*n,this._data={},this._locale=at(),this._bubble()}function Nt(e){return e instanceof Tt}function Pt(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function Rt(e,t){C(e,0,0,(function(){var e=this.utcOffset(),n="+";return e<0&&(e=-e,n="-"),n+T(~~(e/60),2)+t+T(~~e%60,2)}))}Rt("Z",":"),Rt("ZZ",""),ce("Z",he),ce("ZZ",he),ye(["Z","ZZ"],(function(e,t,n){n._useUTC=!0,n._tzm=Ct(he,e)}));var Wt=/([\+\-]|\d\d)/gi;function Ct(e,t){var n,s,i=(t||"").match(e);return null===i?null:0===(s=60*(n=((i[i.length-1]||[])+"").match(Wt)||["-",0,0])[1]+Z(n[2]))?0:"+"===n[0]?s:-s}function Ht(e,t){var s,i;return t._isUTC?(s=t.clone(),i=(v(e)||l(e)?e.valueOf():St(e).valueOf())-s.valueOf(),s._d.setTime(s._d.valueOf()+i),n.updateOffset(s,!1),s):St(e).local()}function Ut(e){return-Math.round(e._d.getTimezoneOffset())}function Ft(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}n.updateOffset=function(){};var Lt=/^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,Vt=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function Gt(e,t){var n,s,i,a=e,o=null;return Nt(e)?a={ms:e._milliseconds,d:e._days,M:e._months}:u(e)||!isNaN(+e)?(a={},t?a[t]=+e:a.milliseconds=+e):(o=Lt.exec(e))?(n="-"===o[1]?-1:1,a={y:0,d:Z(o[2])*n,h:Z(o[3])*n,m:Z(o[4])*n,s:Z(o[5])*n,ms:Z(Pt(1e3*o[6]))*n}):(o=Vt.exec(e))?(n="-"===o[1]?-1:1,a={y:Et(o[2],n),M:Et(o[3],n),w:Et(o[4],n),d:Et(o[5],n),h:Et(o[6],n),m:Et(o[7],n),s:Et(o[8],n)}):null==a?a={}:"object"==typeof a&&("from"in a||"to"in a)&&(i=function(e,t){var n;if(!e.isValid()||!t.isValid())return{milliseconds:0,months:0};t=Ht(t,e),e.isBefore(t)?n=At(e,t):((n=At(t,e)).milliseconds=-n.milliseconds,n.months=-n.months);return n}(St(a.from),St(a.to)),(a={}).ms=i.milliseconds,a.M=i.months),s=new Tt(a),Nt(e)&&r(e,"_locale")&&(s._locale=e._locale),Nt(e)&&r(e,"_isValid")&&(s._isValid=e._isValid),s}function Et(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function At(e,t){var n={};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function jt(e,t){return function(n,s){var i;return null===s||isNaN(+s)||(Y(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),i=n,n=s,s=i),It(this,Gt(n,s),e),this}}function It(e,t,s,i){var r=t._milliseconds,a=Pt(t._days),o=Pt(t._months);e.isValid()&&(i=null==i||i,o&&be(e,$(e,"Month")+o*s),a&&q(e,"Date",$(e,"Date")+a*s),r&&e._d.setTime(e._d.valueOf()+r*s),i&&n.updateOffset(e,a||o))}Gt.fn=Tt.prototype,Gt.invalid=function(){return Gt(NaN)};var Zt=jt(1,"add"),zt=jt(-1,"subtract");function $t(e){return"string"==typeof e||e instanceof String}function qt(e){return v(e)||l(e)||$t(e)||u(e)||function(e){var t=s(e),n=!1;t&&(n=0===e.filter((function(t){return!u(t)&&$t(e)})).length);return t&&n}(e)||function(e){var t,n,s=i(e)&&!a(e),o=!1,u=["years","year","y","months","month","M","days","day","d","dates","date","D","hours","hour","h","minutes","minute","m","seconds","second","s","milliseconds","millisecond","ms"];for(t=0;t<u.length;t+=1)n=u[t],o=o||r(e,n);return s&&o}(e)||null==e}function Bt(e){var t,n=i(e)&&!a(e),s=!1,o=["sameDay","nextDay","lastDay","nextWeek","lastWeek","sameElse"];for(t=0;t<o.length;t+=1)s=s||r(e,o[t]);return n&&s}function Jt(e,t){if(e.date()<t.date())return-Jt(t,e);var n=12*(t.year()-e.year())+(t.month()-e.month()),s=e.clone().add(n,"months");return-(n+(t-s<0?(t-s)/(s-e.clone().add(n-1,"months")):(t-s)/(e.clone().add(n+1,"months")-s)))||0}function Qt(e){var t;return void 0===e?this._locale._abbr:(null!=(t=at(e))&&(this._locale=t),this)}n.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",n.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var Xt=M("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",(function(e){return void 0===e?this.localeData():this.locale(e)}));function Kt(){return this._locale}var en=1e3,tn=6e4,nn=36e5,sn=126227808e5;function rn(e,t){return(e%t+t)%t}function an(e,t,n){return e<100&&e>=0?new Date(e+400,t,n)-sn:new Date(e,t,n).valueOf()}function on(e,t,n){return e<100&&e>=0?Date.UTC(e+400,t,n)-sn:Date.UTC(e,t,n)}function un(e,t){return t.erasAbbrRegex(e)}function ln(){var e,t,n=[],s=[],i=[],r=[],a=this.eras();for(e=0,t=a.length;e<t;++e)s.push(me(a[e].name)),n.push(me(a[e].abbr)),i.push(me(a[e].narrow)),r.push(me(a[e].name)),r.push(me(a[e].abbr)),r.push(me(a[e].narrow));this._erasRegex=new RegExp("^("+r.join("|")+")","i"),this._erasNameRegex=new RegExp("^("+s.join("|")+")","i"),this._erasAbbrRegex=new RegExp("^("+n.join("|")+")","i"),this._erasNarrowRegex=new RegExp("^("+i.join("|")+")","i")}function hn(e,t){C(0,[e,e.length],0,t)}function dn(e,t,n,s,i){var r;return null==e?Ue(this,s,i).year:(t>(r=Fe(e,s,i))&&(t=r),cn.call(this,e,t,n,s,i))}function cn(e,t,n,s,i){var r=He(e,t,n,s,i),a=We(r.year,0,r.dayOfYear);return this.year(a.getUTCFullYear()),this.month(a.getUTCMonth()),this.date(a.getUTCDate()),this}C("N",0,0,"eraAbbr"),C("NN",0,0,"eraAbbr"),C("NNN",0,0,"eraAbbr"),C("NNNN",0,0,"eraName"),C("NNNNN",0,0,"eraNarrow"),C("y",["y",1],"yo","eraYear"),C("y",["yy",2],0,"eraYear"),C("y",["yyy",3],0,"eraYear"),C("y",["yyyy",4],0,"eraYear"),ce("N",un),ce("NN",un),ce("NNN",un),ce("NNNN",(function(e,t){return t.erasNameRegex(e)})),ce("NNNNN",(function(e,t){return t.erasNarrowRegex(e)})),ye(["N","NN","NNN","NNNN","NNNNN"],(function(e,t,n,s){var i=n._locale.erasParse(e,s,n._strict);i?f(n).era=i:f(n).invalidEra=e})),ce("y",oe),ce("yy",oe),ce("yyy",oe),ce("yyyy",oe),ce("yo",(function(e,t){return t._eraYearOrdinalRegex||oe})),ye(["y","yy","yyy","yyyy"],0),ye(["yo"],(function(e,t,n,s){var i;n._locale._eraYearOrdinalRegex&&(i=e.match(n._locale._eraYearOrdinalRegex)),n._locale.eraYearOrdinalParse?t[0]=n._locale.eraYearOrdinalParse(e,i):t[0]=parseInt(e,10)})),C(0,["gg",2],0,(function(){return this.weekYear()%100})),C(0,["GG",2],0,(function(){return this.isoWeekYear()%100})),hn("gggg","weekYear"),hn("ggggg","weekYear"),hn("GGGG","isoWeekYear"),hn("GGGGG","isoWeekYear"),L("weekYear","gg"),L("isoWeekYear","GG"),A("weekYear",1),A("isoWeekYear",1),ce("G",ue),ce("g",ue),ce("GG",te,Q),ce("gg",te,Q),ce("GGGG",re,K),ce("gggg",re,K),ce("GGGGG",ae,ee),ce("ggggg",ae,ee),ge(["gggg","ggggg","GGGG","GGGGG"],(function(e,t,n,s){t[s.substr(0,2)]=Z(e)})),ge(["gg","GG"],(function(e,t,s,i){t[i]=n.parseTwoDigitYear(e)})),C("Q",0,"Qo","quarter"),L("quarter","Q"),A("quarter",7),ce("Q",J),ye("Q",(function(e,t){t[1]=3*(Z(e)-1)})),C("D",["DD",2],"Do","date"),L("date","D"),A("date",9),ce("D",te),ce("DD",te,Q),ce("Do",(function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient})),ye(["D","DD"],2),ye("Do",(function(e,t){t[2]=Z(e.match(te)[0])}));var fn=z("Date",!0);C("DDD",["DDDD",3],"DDDo","dayOfYear"),L("dayOfYear","DDD"),A("dayOfYear",4),ce("DDD",ie),ce("DDDD",X),ye(["DDD","DDDD"],(function(e,t,n){n._dayOfYear=Z(e)})),C("m",["mm",2],0,"minute"),L("minute","m"),A("minute",14),ce("m",te),ce("mm",te,Q),ye(["m","mm"],4);var mn=z("Minutes",!1);C("s",["ss",2],0,"second"),L("second","s"),A("second",15),ce("s",te),ce("ss",te,Q),ye(["s","ss"],5);var _n,yn,gn=z("Seconds",!1);for(C("S",0,0,(function(){return~~(this.millisecond()/100)})),C(0,["SS",2],0,(function(){return~~(this.millisecond()/10)})),C(0,["SSS",3],0,"millisecond"),C(0,["SSSS",4],0,(function(){return 10*this.millisecond()})),C(0,["SSSSS",5],0,(function(){return 100*this.millisecond()})),C(0,["SSSSSS",6],0,(function(){return 1e3*this.millisecond()})),C(0,["SSSSSSS",7],0,(function(){return 1e4*this.millisecond()})),C(0,["SSSSSSSS",8],0,(function(){return 1e5*this.millisecond()})),C(0,["SSSSSSSSS",9],0,(function(){return 1e6*this.millisecond()})),L("millisecond","ms"),A("millisecond",16),ce("S",ie,J),ce("SS",ie,Q),ce("SSS",ie,X),_n="SSSS";_n.length<=9;_n+="S")ce(_n,oe);function wn(e,t){t[6]=Z(1e3*("0."+e))}for(_n="S";_n.length<=9;_n+="S")ye(_n,wn);yn=z("Milliseconds",!1),C("z",0,0,"zoneAbbr"),C("zz",0,0,"zoneName");var pn=p.prototype;function vn(e){return e}pn.add=Zt,pn.calendar=function(e,t){1===arguments.length&&(arguments[0]?qt(arguments[0])?(e=arguments[0],t=void 0):Bt(arguments[0])&&(t=arguments[0],e=void 0):(e=void 0,t=void 0));var s=e||St(),i=Ht(s,this).startOf("day"),r=n.calendarFormat(this,i)||"sameElse",a=t&&(O(t[r])?t[r].call(this,s):t[r]);return this.format(a||this.localeData().calendar(r,this,St(s)))},pn.clone=function(){return new p(this)},pn.diff=function(e,t,n){var s,i,r;if(!this.isValid())return NaN;if(!(s=Ht(e,this)).isValid())return NaN;switch(i=6e4*(s.utcOffset()-this.utcOffset()),t=V(t)){case"year":r=Jt(this,s)/12;break;case"month":r=Jt(this,s);break;case"quarter":r=Jt(this,s)/3;break;case"second":r=(this-s)/1e3;break;case"minute":r=(this-s)/6e4;break;case"hour":r=(this-s)/36e5;break;case"day":r=(this-s-i)/864e5;break;case"week":r=(this-s-i)/6048e5;break;default:r=this-s}return n?r:I(r)},pn.endOf=function(e){var t,s;if(void 0===(e=V(e))||"millisecond"===e||!this.isValid())return this;switch(s=this._isUTC?on:an,e){case"year":t=s(this.year()+1,0,1)-1;break;case"quarter":t=s(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":t=s(this.year(),this.month()+1,1)-1;break;case"week":t=s(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":t=s(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":t=s(this.year(),this.month(),this.date()+1)-1;break;case"hour":t=this._d.valueOf(),t+=nn-rn(t+(this._isUTC?0:this.utcOffset()*tn),nn)-1;break;case"minute":t=this._d.valueOf(),t+=tn-rn(t,tn)-1;break;case"second":t=this._d.valueOf(),t+=en-rn(t,en)-1}return this._d.setTime(t),n.updateOffset(this,!0),this},pn.format=function(e){e||(e=this.isUtc()?n.defaultFormatUtc:n.defaultFormat);var t=H(this,e);return this.localeData().postformat(t)},pn.from=function(e,t){return this.isValid()&&(v(e)&&e.isValid()||St(e).isValid())?Gt({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},pn.fromNow=function(e){return this.from(St(),e)},pn.to=function(e,t){return this.isValid()&&(v(e)&&e.isValid()||St(e).isValid())?Gt({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},pn.toNow=function(e){return this.to(St(),e)},pn.get=function(e){return O(this[e=V(e)])?this[e]():this},pn.invalidAt=function(){return f(this).overflow},pn.isAfter=function(e,t){var n=v(e)?e:St(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())},pn.isBefore=function(e,t){var n=v(e)?e:St(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())},pn.isBetween=function(e,t,n,s){var i=v(e)?e:St(e),r=v(t)?t:St(t);return!!(this.isValid()&&i.isValid()&&r.isValid())&&(("("===(s=s||"()")[0]?this.isAfter(i,n):!this.isBefore(i,n))&&(")"===s[1]?this.isBefore(r,n):!this.isAfter(r,n)))},pn.isSame=function(e,t){var n,s=v(e)?e:St(e);return!(!this.isValid()||!s.isValid())&&("millisecond"===(t=V(t)||"millisecond")?this.valueOf()===s.valueOf():(n=s.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))},pn.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},pn.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},pn.isValid=function(){return m(this)},pn.lang=Xt,pn.locale=Qt,pn.localeData=Kt,pn.max=Ot,pn.min=Yt,pn.parsingFlags=function(){return d({},f(this))},pn.set=function(e,t){if("object"==typeof e){var n,s=function(e){var t,n=[];for(t in e)r(e,t)&&n.push({unit:t,priority:E[t]});return n.sort((function(e,t){return e.priority-t.priority})),n}(e=G(e));for(n=0;n<s.length;n++)this[s[n].unit](e[s[n].unit])}else if(O(this[e=V(e)]))return this[e](t);return this},pn.startOf=function(e){var t,s;if(void 0===(e=V(e))||"millisecond"===e||!this.isValid())return this;switch(s=this._isUTC?on:an,e){case"year":t=s(this.year(),0,1);break;case"quarter":t=s(this.year(),this.month()-this.month()%3,1);break;case"month":t=s(this.year(),this.month(),1);break;case"week":t=s(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":t=s(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":t=s(this.year(),this.month(),this.date());break;case"hour":t=this._d.valueOf(),t-=rn(t+(this._isUTC?0:this.utcOffset()*tn),nn);break;case"minute":t=this._d.valueOf(),t-=rn(t,tn);break;case"second":t=this._d.valueOf(),t-=rn(t,en)}return this._d.setTime(t),n.updateOffset(this,!0),this},pn.subtract=zt,pn.toArray=function(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]},pn.toObject=function(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}},pn.toDate=function(){return new Date(this.valueOf())},pn.toISOString=function(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||n.year()>9999?H(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):O(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",H(n,"Z")):H(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},pn.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e,t,n,s="moment",i="";return this.isLocal()||(s=0===this.utcOffset()?"moment.utc":"moment.parseZone",i="Z"),e="["+s+'("]',t=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY","-MM-DD[T]HH:mm:ss.SSS",n=i+'[")]',this.format(e+t+"-MM-DD[T]HH:mm:ss.SSS"+n)},"undefined"!=typeof Symbol&&null!=Symbol.for&&(pn[Symbol.for("nodejs.util.inspect.custom")]=function(){return"Moment<"+this.format()+">"}),pn.toJSON=function(){return this.isValid()?this.toISOString():null},pn.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},pn.unix=function(){return Math.floor(this.valueOf()/1e3)},pn.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},pn.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},pn.eraName=function(){var e,t,n,s=this.localeData().eras();for(e=0,t=s.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),s[e].since<=n&&n<=s[e].until)return s[e].name;if(s[e].until<=n&&n<=s[e].since)return s[e].name}return""},pn.eraNarrow=function(){var e,t,n,s=this.localeData().eras();for(e=0,t=s.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),s[e].since<=n&&n<=s[e].until)return s[e].narrow;if(s[e].until<=n&&n<=s[e].since)return s[e].narrow}return""},pn.eraAbbr=function(){var e,t,n,s=this.localeData().eras();for(e=0,t=s.length;e<t;++e){if(n=this.clone().startOf("day").valueOf(),s[e].since<=n&&n<=s[e].until)return s[e].abbr;if(s[e].until<=n&&n<=s[e].since)return s[e].abbr}return""},pn.eraYear=function(){var e,t,s,i,r=this.localeData().eras();for(e=0,t=r.length;e<t;++e)if(s=r[e].since<=r[e].until?1:-1,i=this.clone().startOf("day").valueOf(),r[e].since<=i&&i<=r[e].until||r[e].until<=i&&i<=r[e].since)return(this.year()-n(r[e].since).year())*s+r[e].offset;return this.year()},pn.year=Pe,pn.isLeapYear=function(){return j(this.year())},pn.weekYear=function(e){return dn.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},pn.isoWeekYear=function(e){return dn.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},pn.quarter=pn.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},pn.month=xe,pn.daysInMonth=function(){return ve(this.year(),this.month())},pn.week=pn.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},pn.isoWeek=pn.isoWeeks=function(e){var t=Ue(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},pn.weeksInYear=function(){var e=this.localeData()._week;return Fe(this.year(),e.dow,e.doy)},pn.weeksInWeekYear=function(){var e=this.localeData()._week;return Fe(this.weekYear(),e.dow,e.doy)},pn.isoWeeksInYear=function(){return Fe(this.year(),1,4)},pn.isoWeeksInISOWeekYear=function(){return Fe(this.isoWeekYear(),1,4)},pn.date=fn,pn.day=pn.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=function(e,t){return"string"!=typeof e?e:isNaN(e)?"number"==typeof(e=t.weekdaysParse(e))?e:null:parseInt(e,10)}(e,this.localeData()),this.add(e-t,"d")):t},pn.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},pn.isoWeekday=function(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=function(e,t){return"string"==typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7},pn.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},pn.hour=pn.hours=Je,pn.minute=pn.minutes=mn,pn.second=pn.seconds=gn,pn.millisecond=pn.milliseconds=yn,pn.utcOffset=function(e,t,s){var i,r=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null!=e){if("string"==typeof e){if(null===(e=Ct(he,e)))return this}else Math.abs(e)<16&&!s&&(e*=60);return!this._isUTC&&t&&(i=Ut(this)),this._offset=e,this._isUTC=!0,null!=i&&this.add(i,"m"),r!==e&&(!t||this._changeInProgress?It(this,Gt(e-r,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,n.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?r:Ut(this)},pn.utc=function(e){return this.utcOffset(0,e)},pn.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Ut(this),"m")),this},pn.parseZone=function(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var e=Ct(le,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this},pn.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?St(e).utcOffset():0,(this.utcOffset()-e)%60==0)},pn.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},pn.isLocal=function(){return!!this.isValid()&&!this._isUTC},pn.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},pn.isUtc=Ft,pn.isUTC=Ft,pn.zoneAbbr=function(){return this._isUTC?"UTC":""},pn.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},pn.dates=M("dates accessor is deprecated. Use date instead.",fn),pn.months=M("months accessor is deprecated. Use month instead",xe),pn.years=M("years accessor is deprecated. Use year instead",Pe),pn.zone=M("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",(function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()})),pn.isDSTShifted=M("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",(function(){if(!o(this._isDSTShifted))return this._isDSTShifted;var e,t={};return w(t,this),(t=Mt(t))._a?(e=t._isUTC?c(t._a):St(t._a),this._isDSTShifted=this.isValid()&&function(e,t,n){var s,i=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),a=0;for(s=0;s<i;s++)(n&&e[s]!==t[s]||!n&&Z(e[s])!==Z(t[s]))&&a++;return a+r}(t._a,e.toArray())>0):this._isDSTShifted=!1,this._isDSTShifted}));var kn=x.prototype;function Mn(e,t,n,s){var i=at(),r=c().set(s,t);return i[n](r,e)}function Dn(e,t,n){if(u(e)&&(t=e,e=void 0),e=e||"",null!=t)return Mn(e,t,n,"month");var s,i=[];for(s=0;s<12;s++)i[s]=Mn(e,s,n,"month");return i}function Sn(e,t,n,s){"boolean"==typeof e?(u(t)&&(n=t,t=void 0),t=t||""):(n=t=e,e=!1,u(t)&&(n=t,t=void 0),t=t||"");var i,r=at(),a=e?r._week.dow:0,o=[];if(null!=n)return Mn(t,(n+a)%7,s,"day");for(i=0;i<7;i++)o[i]=Mn(t,(i+a)%7,s,"day");return o}kn.calendar=function(e,t,n){var s=this._calendar[e]||this._calendar.sameElse;return O(s)?s.call(t,n):s},kn.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.match(N).map((function(e){return"MMMM"===e||"MM"===e||"DD"===e||"dddd"===e?e.slice(1):e})).join(""),this._longDateFormat[e])},kn.invalidDate=function(){return this._invalidDate},kn.ordinal=function(e){return this._ordinal.replace("%d",e)},kn.preparse=vn,kn.postformat=vn,kn.relativeTime=function(e,t,n,s){var i=this._relativeTime[n];return O(i)?i(e,t,n,s):i.replace(/%d/i,e)},kn.pastFuture=function(e,t){var n=this._relativeTime[e>0?"future":"past"];return O(n)?n(t):n.replace(/%s/i,t)},kn.set=function(e){var t,n;for(n in e)r(e,n)&&(O(t=e[n])?this[n]=t:this["_"+n]=t);this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},kn.eras=function(e,t){var s,i,r,a=this._eras||at("en")._eras;for(s=0,i=a.length;s<i;++s){switch(typeof a[s].since){case"string":r=n(a[s].since).startOf("day"),a[s].since=r.valueOf()}switch(typeof a[s].until){case"undefined":a[s].until=1/0;break;case"string":r=n(a[s].until).startOf("day").valueOf(),a[s].until=r.valueOf()}}return a},kn.erasParse=function(e,t,n){var s,i,r,a,o,u=this.eras();for(e=e.toUpperCase(),s=0,i=u.length;s<i;++s)if(r=u[s].name.toUpperCase(),a=u[s].abbr.toUpperCase(),o=u[s].narrow.toUpperCase(),n)switch(t){case"N":case"NN":case"NNN":if(a===e)return u[s];break;case"NNNN":if(r===e)return u[s];break;case"NNNNN":if(o===e)return u[s]}else if([r,a,o].indexOf(e)>=0)return u[s]},kn.erasConvertYear=function(e,t){var s=e.since<=e.until?1:-1;return void 0===t?n(e.since).year():n(e.since).year()+(t-e.offset)*s},kn.erasAbbrRegex=function(e){return r(this,"_erasAbbrRegex")||ln.call(this),e?this._erasAbbrRegex:this._erasRegex},kn.erasNameRegex=function(e){return r(this,"_erasNameRegex")||ln.call(this),e?this._erasNameRegex:this._erasRegex},kn.erasNarrowRegex=function(e){return r(this,"_erasNarrowRegex")||ln.call(this),e?this._erasNarrowRegex:this._erasRegex},kn.months=function(e,t){return e?s(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||De).test(t)?"format":"standalone"][e.month()]:s(this._months)?this._months:this._months.standalone},kn.monthsShort=function(e,t){return e?s(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[De.test(t)?"format":"standalone"][e.month()]:s(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},kn.monthsParse=function(e,t,n){var s,i,r;if(this._monthsParseExact)return Oe.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(i=c([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(r="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[s]=new RegExp(r.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},kn.monthsRegex=function(e){return this._monthsParseExact?(r(this,"_monthsRegex")||Te.call(this),e?this._monthsStrictRegex:this._monthsRegex):(r(this,"_monthsRegex")||(this._monthsRegex=Ye),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},kn.monthsShortRegex=function(e){return this._monthsParseExact?(r(this,"_monthsRegex")||Te.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(r(this,"_monthsShortRegex")||(this._monthsShortRegex=Se),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},kn.week=function(e){return Ue(e,this._week.dow,this._week.doy).week},kn.firstDayOfYear=function(){return this._week.doy},kn.firstDayOfWeek=function(){return this._week.dow},kn.weekdays=function(e,t){var n=s(this._weekdays)?this._weekdays:this._weekdays[e&&!0!==e&&this._weekdays.isFormat.test(t)?"format":"standalone"];return!0===e?Le(n,this._week.dow):e?n[e.day()]:n},kn.weekdaysMin=function(e){return!0===e?Le(this._weekdaysMin,this._week.dow):e?this._weekdaysMin[e.day()]:this._weekdaysMin},kn.weekdaysShort=function(e){return!0===e?Le(this._weekdaysShort,this._week.dow):e?this._weekdaysShort[e.day()]:this._weekdaysShort},kn.weekdaysParse=function(e,t,n){var s,i,r;if(this._weekdaysParseExact)return Ze.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(i=c([2e3,1]).day(s),n&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(i,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(i,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(i,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[s]||(r="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[s]=new RegExp(r.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[s].test(e))return s;if(n&&"ddd"===t&&this._shortWeekdaysParse[s].test(e))return s;if(n&&"dd"===t&&this._minWeekdaysParse[s].test(e))return s;if(!n&&this._weekdaysParse[s].test(e))return s}},kn.weekdaysRegex=function(e){return this._weekdaysParseExact?(r(this,"_weekdaysRegex")||ze.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(r(this,"_weekdaysRegex")||(this._weekdaysRegex=Ae),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},kn.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(r(this,"_weekdaysRegex")||ze.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(r(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=je),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},kn.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(r(this,"_weekdaysRegex")||ze.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(r(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=Ie),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},kn.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},kn.meridiem=function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},it("en",{eras:[{since:"0001-01-01",until:1/0,offset:1,name:"Anno Domini",narrow:"AD",abbr:"AD"},{since:"0000-12-31",until:-1/0,offset:1,name:"Before Christ",narrow:"BC",abbr:"BC"}],dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===Z(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}}),n.lang=M("moment.lang is deprecated. Use moment.locale instead.",it),n.langData=M("moment.langData is deprecated. Use moment.localeData instead.",at);var Yn=Math.abs;function On(e,t,n,s){var i=Gt(t,n);return e._milliseconds+=s*i._milliseconds,e._days+=s*i._days,e._months+=s*i._months,e._bubble()}function bn(e){return e<0?Math.floor(e):Math.ceil(e)}function xn(e){return 4800*e/146097}function Tn(e){return 146097*e/4800}function Nn(e){return function(){return this.as(e)}}var Pn=Nn("ms"),Rn=Nn("s"),Wn=Nn("m"),Cn=Nn("h"),Hn=Nn("d"),Un=Nn("w"),Fn=Nn("M"),Ln=Nn("Q"),Vn=Nn("y");function Gn(e){return function(){return this.isValid()?this._data[e]:NaN}}var En=Gn("milliseconds"),An=Gn("seconds"),jn=Gn("minutes"),In=Gn("hours"),Zn=Gn("days"),zn=Gn("months"),$n=Gn("years");var qn=Math.round,Bn={ss:44,s:45,m:45,h:22,d:26,w:null,M:11};function Jn(e,t,n,s,i){return i.relativeTime(t||1,!!n,e,s)}var Qn=Math.abs;function Xn(e){return(e>0)-(e<0)||+e}function Kn(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n,s,i,r,a,o,u=Qn(this._milliseconds)/1e3,l=Qn(this._days),h=Qn(this._months),d=this.asSeconds();return d?(e=I(u/60),t=I(e/60),u%=60,e%=60,n=I(h/12),h%=12,s=u?u.toFixed(3).replace(/\.?0+$/,""):"",i=d<0?"-":"",r=Xn(this._months)!==Xn(d)?"-":"",a=Xn(this._days)!==Xn(d)?"-":"",o=Xn(this._milliseconds)!==Xn(d)?"-":"",i+"P"+(n?r+n+"Y":"")+(h?r+h+"M":"")+(l?a+l+"D":"")+(t||e||u?"T":"")+(t?o+t+"H":"")+(e?o+e+"M":"")+(u?o+s+"S":"")):"P0D"}var es=Tt.prototype;return es.isValid=function(){return this._isValid},es.abs=function(){var e=this._data;return this._milliseconds=Yn(this._milliseconds),this._days=Yn(this._days),this._months=Yn(this._months),e.milliseconds=Yn(e.milliseconds),e.seconds=Yn(e.seconds),e.minutes=Yn(e.minutes),e.hours=Yn(e.hours),e.months=Yn(e.months),e.years=Yn(e.years),this},es.add=function(e,t){return On(this,e,t,1)},es.subtract=function(e,t){return On(this,e,t,-1)},es.as=function(e){if(!this.isValid())return NaN;var t,n,s=this._milliseconds;if("month"===(e=V(e))||"quarter"===e||"year"===e)switch(t=this._days+s/864e5,n=this._months+xn(t),e){case"month":return n;case"quarter":return n/3;case"year":return n/12}else switch(t=this._days+Math.round(Tn(this._months)),e){case"week":return t/7+s/6048e5;case"day":return t+s/864e5;case"hour":return 24*t+s/36e5;case"minute":return 1440*t+s/6e4;case"second":return 86400*t+s/1e3;case"millisecond":return Math.floor(864e5*t)+s;default:throw new Error("Unknown unit "+e)}},es.asMilliseconds=Pn,es.asSeconds=Rn,es.asMinutes=Wn,es.asHours=Cn,es.asDays=Hn,es.asWeeks=Un,es.asMonths=Fn,es.asQuarters=Ln,es.asYears=Vn,es.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*Z(this._months/12):NaN},es._bubble=function(){var e,t,n,s,i,r=this._milliseconds,a=this._days,o=this._months,u=this._data;return r>=0&&a>=0&&o>=0||r<=0&&a<=0&&o<=0||(r+=864e5*bn(Tn(o)+a),a=0,o=0),u.milliseconds=r%1e3,e=I(r/1e3),u.seconds=e%60,t=I(e/60),u.minutes=t%60,n=I(t/60),u.hours=n%24,a+=I(n/24),o+=i=I(xn(a)),a-=bn(Tn(i)),s=I(o/12),o%=12,u.days=a,u.months=o,u.years=s,this},es.clone=function(){return Gt(this)},es.get=function(e){return e=V(e),this.isValid()?this[e+"s"]():NaN},es.milliseconds=En,es.seconds=An,es.minutes=jn,es.hours=In,es.days=Zn,es.weeks=function(){return I(this.days()/7)},es.months=zn,es.years=$n,es.humanize=function(e,t){if(!this.isValid())return this.localeData().invalidDate();var n,s,i=!1,r=Bn;return"object"==typeof e&&(t=e,e=!1),"boolean"==typeof e&&(i=e),"object"==typeof t&&(r=Object.assign({},Bn,t),null!=t.s&&null==t.ss&&(r.ss=t.s-1)),s=function(e,t,n,s){var i=Gt(e).abs(),r=qn(i.as("s")),a=qn(i.as("m")),o=qn(i.as("h")),u=qn(i.as("d")),l=qn(i.as("M")),h=qn(i.as("w")),d=qn(i.as("y")),c=r<=n.ss&&["s",r]||r<n.s&&["ss",r]||a<=1&&["m"]||a<n.m&&["mm",a]||o<=1&&["h"]||o<n.h&&["hh",o]||u<=1&&["d"]||u<n.d&&["dd",u];return null!=n.w&&(c=c||h<=1&&["w"]||h<n.w&&["ww",h]),(c=c||l<=1&&["M"]||l<n.M&&["MM",l]||d<=1&&["y"]||["yy",d])[2]=t,c[3]=+e>0,c[4]=s,Jn.apply(null,c)}(this,!i,r,n=this.localeData()),i&&(s=n.pastFuture(+this,s)),n.postformat(s)},es.toISOString=Kn,es.toString=Kn,es.toJSON=Kn,es.locale=Qt,es.localeData=Kt,es.toIsoString=M("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Kn),es.lang=Xt,C("X",0,0,"unix"),C("x",0,0,"valueOf"),ce("x",ue),ce("X",/[+-]?\d+(\.\d{1,3})?/),ye("X",(function(e,t,n){n._d=new Date(1e3*parseFloat(e))})),ye("x",(function(e,t,n){n._d=new Date(Z(e))})),
//! moment.js
n.version="2.29.1",e=St,n.fn=pn,n.min=function(){var e=[].slice.call(arguments,0);return bt("isBefore",e)},n.max=function(){var e=[].slice.call(arguments,0);return bt("isAfter",e)},n.now=function(){return Date.now?Date.now():+new Date},n.utc=c,n.unix=function(e){return St(1e3*e)},n.months=function(e,t){return Dn(e,t,"months")},n.isDate=l,n.locale=it,n.invalid=_,n.duration=Gt,n.isMoment=v,n.weekdays=function(e,t,n){return Sn(e,t,n,"weekdays")},n.parseZone=function(){return St.apply(null,arguments).parseZone()},n.localeData=at,n.isDuration=Nt,n.monthsShort=function(e,t){return Dn(e,t,"monthsShort")},n.weekdaysMin=function(e,t,n){return Sn(e,t,n,"weekdaysMin")},n.defineLocale=rt,n.updateLocale=function(e,t){if(null!=t){var n,s,i=Xe;null!=Ke[e]&&null!=Ke[e].parentLocale?Ke[e].set(b(Ke[e]._config,t)):(null!=(s=st(e))&&(i=s._config),t=b(i,t),null==s&&(t.abbr=e),(n=new x(t)).parentLocale=Ke[e],Ke[e]=n),it(e)}else null!=Ke[e]&&(null!=Ke[e].parentLocale?(Ke[e]=Ke[e].parentLocale,e===it()&&it(e)):null!=Ke[e]&&delete Ke[e]);return Ke[e]},n.locales=function(){return D(Ke)},n.weekdaysShort=function(e,t,n){return Sn(e,t,n,"weekdaysShort")},n.normalizeUnits=V,n.relativeTimeRounding=function(e){return void 0===e?qn:"function"==typeof e&&(qn=e,!0)},n.relativeTimeThreshold=function(e,t){return void 0!==Bn[e]&&(void 0===t?Bn[e]:(Bn[e]=t,"s"===e&&(Bn.ss=t-1),!0))},n.calendarFormat=function(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"},n.prototype=pn,n.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},n}));

},{}],"common-services":[function(require,module,exports){
const QuestionnaireService = require("./services/iot/QuestionnaireService");
module.exports = {
    DidService:require("./services/DidService"),
    CommunicationService: require("./services/CommunicationService"),
    DPService:require("./services/iot/DPService"),
    MessageHandlerService: require("./services/MessageHandlerService"),
    DateTimeService: require("./services/DateTimeService"),
    DSUService: require("./services/DSUService"),
    SharedStorage: require("./services/SharedStorage"),
    AbstractAPI: require("./services/AbstractAPI"),
    JWTService: require("./services/JWTService"),
    BaseRepository: require("./repositories/BaseRepository"),
    Constants: require("./utils/Constants"),
    momentService: require('./utils/moment.min'),
    FileDownloader: require("./utils/FileDownloader"),
    FileDownloaderService: require("./utils/FileDownloaderService"),
    HeaderController: require("./utils/HeaderController"),
    EvidenceService:require("./services/iot/EvidenceService"),
    DeviceServices: require("./services/iot/DeviceServices"),
    QuestionnaireService: require("./services/iot/QuestionnaireService"),
    DeviceAssignationService: require("./services/iot/DeviceAssignationService"),
    HealthDataService: require ("./services/iot/HealthDataService"),
    PermissionedHealthDataService: require("./services/iot/PermissionedHealthDataService"),
    StudiesService: require("./services/iot/StudiesService"),
    StudyNotesService: require("./services/iot/StudyNotesService"),
    ResponsesService: require("./services/iot/ResponsesService"),
    models: require("./models"),
    getDataSourceFactory: () => require("./factories/DataSourceFactory"),
    getBreadCrumbManager: () => require("./others/BreadCrumbManager")
};
},{"./factories/DataSourceFactory":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\factories\\DataSourceFactory.js","./models":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\models\\index.js","./others/BreadCrumbManager":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\others\\BreadCrumbManager.js","./repositories/BaseRepository":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\repositories\\BaseRepository.js","./services/AbstractAPI":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\AbstractAPI.js","./services/CommunicationService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\CommunicationService.js","./services/DSUService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DSUService.js","./services/DateTimeService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DateTimeService.js","./services/DidService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\DidService.js","./services/JWTService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\JWTService.js","./services/MessageHandlerService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\MessageHandlerService.js","./services/SharedStorage":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\SharedStorage.js","./services/iot/DPService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DPService.js","./services/iot/DeviceAssignationService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DeviceAssignationService.js","./services/iot/DeviceServices":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\DeviceServices.js","./services/iot/EvidenceService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\EvidenceService.js","./services/iot/HealthDataService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\HealthDataService.js","./services/iot/PermissionedHealthDataService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\PermissionedHealthDataService.js","./services/iot/QuestionnaireService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\QuestionnaireService.js","./services/iot/ResponsesService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\ResponsesService.js","./services/iot/StudiesService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\StudiesService.js","./services/iot/StudyNotesService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\services\\iot\\StudyNotesService.js","./utils/Constants":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\Constants.js","./utils/FileDownloader":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\FileDownloader.js","./utils/FileDownloaderService":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\FileDownloaderService.js","./utils/HeaderController":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\HeaderController.js","./utils/moment.min":"D:\\workspace\\eco-iot-pmed-workspace\\common-services\\utils\\moment.min.js"}]},{},["D:\\workspace\\eco-iot-pmed-workspace\\common-services\\builds\\tmp\\commonServices_intermediar.js"])
                    ;(function(global) {
                        global.bundlePaths = {"commonServices":"build\\bundles\\commonServices.js"};
                    })(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
                