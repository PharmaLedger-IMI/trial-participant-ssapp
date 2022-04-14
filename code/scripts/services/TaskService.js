const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class TaskService extends DSUService {

    constructor() {
        super ('/tasks');
    }

    getTasks = (callback) => this.getEntities(callback);

    saveTasks = (data, callback) => {
        this.saveEntity(data, callback)
    };

    updateTasks = (data, callback) => this.updateEntity(data, callback);

}