import {getTestTaskModel} from "../models/TaskModel.js";

const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

class TaskService extends DSUService {

    constructor() {
        super ('/tasks');
        this.tasks = null;
    }

    getTasks = (callback) => {
        if(this.tasks) {
           return callback(undefined, this.tasks);
        }
        this.getEntities((err, entities) => {
            if(err) {
                return callback(err);
            }
            if(entities.length > 0) {
                this.tasks = entities[0];
            } else {
                return this.saveTasks(getTestTaskModel(), (err,data) => {
                    if(err) {
                        return callback(err);
                    }
                    this.tasks = data;
                    callback(undefined, this.tasks);
                })
            }
            callback(undefined, this.tasks);
        });
    };

    addTask = (task, callback) => {
        this.getTasks((err,tasks) => {
            if(err) {
               return callback(err);
            }
            if(!tasks.item) {
                tasks.item = [];
            }
            debugger;
            tasks.item.push(task);
            this.updateTasks(tasks,callback);
        });
    }

    saveTasks = (data, callback) => {
        this.saveEntity(data, callback)
    };

    updateTasks = (data, callback) => this.updateEntity(data, callback);

}

let instance = null

const getTaskService = ()=>{
    if (!instance) {
        instance = new TaskService()
    }
    return instance
}

export default { getTaskService }