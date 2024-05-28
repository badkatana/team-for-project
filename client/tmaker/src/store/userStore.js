import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this.auth = false
        this._email = ""
        this._id = 0
        
        this.program = ""
        this.role = ""
        this.year = ""
        this.group = 1
        this.studentsOutIds = []

        makeAutoObservable(this)
    }
    setRole(role) {
        this.role = role
    }
    getRole() {
        return this.role
    }

    setProgram(program) {
        this.program = program
    }

    getProgram() {
        return this.program
    }

    setYear(year) {
        this.year = year
    }

    getYear() {
        return this.year
    }

    setGroup(group) {
        this.group = group
    }
    
    getGroup() {
        return this.group
    }

    setAuth(flag) {
        this.auth = flag
    }
    
    setID(id) {
        this._id = id
    }

    getId() {
        return this._id
    }

    getAuth() {
        return this.auth
    }

    setEmail(email) {
        this._email = email
    }

    getEmail() {
        return this._email
    }
}