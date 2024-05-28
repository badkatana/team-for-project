import { makeAutoObservable } from "mobx";

export default class ProjectsStore {
    constructor() {
        this.projectsID = [] 
        this.userProjects = [] // отправить в нейронку
        makeAutoObservable(this)
    }

    setProject(project) {
        this.userProjects = project
    }

    getProjects() {
        return this.userProjects
    }

    getProjectCreated(id) {
        this.projectsID.push(id)
    }
}