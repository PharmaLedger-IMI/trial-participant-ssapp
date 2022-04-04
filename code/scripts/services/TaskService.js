const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class TaskService extends DSUService {

    constructor() {
        super ('/tasks');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getAllTasks = (callback) => this.getEntities(callback);

    getTask = (callback) => this.getEntity(uid, callback);

    saveTask = (callback) => this.saveEntity(data, callback);

    updateTask = (callback) => this.updateEntity(data, callback);

}