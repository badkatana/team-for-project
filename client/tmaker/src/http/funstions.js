import { jwtDecode } from 'jwt-decode'
import {$authHost, $host, $neuronHost} from './index'

export const getAllPrograms = async() => {
    const response = await $authHost.get('api/program/')
    return response
}

export const getYears = async() => {
    const response = await $authHost.get('api/year/')
    return response
}

export const getGroups = async() => {
    const response = await $authHost.get('api/group')
    return response
}

export const getTopSkills = async() => {
    const {data} = await $authHost.get('api/tags/popular')
    return data
}

export const getSkills = async() => {
    const {data} = await $authHost.get('api/tags/')
    return data 
}

export const createProject = async(_name, description, user_id, skills) => {
    const {data} = await $authHost.post('api/project/create', {_name, description, user_id, skills})
    return data
}

export const getProjects = async(user_id) => {
    const {data} = await $authHost.get('api/project/all', {params: { user_id}})
    return data
}

export const getTeams = async(project, year, programID, groupID) => {
    const requestData = {
        year: year,
        programID: programID, 
        groupID: groupID,
        project: project
    };

    const {data} = await $neuronHost.post('/', requestData)
    return data 
}

export const getStudents = async(team_id) => {
    const {data} = await $host.get('api/student', {params: {team_id}})
    return data
}

export const registration = async(email, pwd) => {
    const {data} = await $host.post('/api/user/reg', {email, pwd})
    localStorage.setItem('token', data.token)
    return data
}

export const login = async(email, pwd) => {
    const {data} = await $host.post('/api/user/login', {email, pwd})
    localStorage.setItem('token', data.token)
    return data
}

export const check = async() => {
    const {data} = await $authHost.get('api/user/check')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getAllStudents = async() => {
    const {data} = await $authHost.get('api/allstudents')
    return data
}

export const updateStudent = async(st_id, gpa, surname, name, patronym, year, group, program_name,pseudo) => {
    const {data} = await $authHost.post('api/student-update', {st_id, gpa, surname, name, patronym, year, group, program_name,pseudo})
    return data
}

export const updateStudentSkills = async(st_id, skills) => {
    const {data} = await $authHost.post('api/student-skills', {st_id, skills})
}

export const createStudent = async(surname, student_name, patronym, group, year, program_name, skills, gpa, pseudo) => {
    const {data} = await $authHost.post('api/student-create', {surname, student_name, patronym, group, year, program_name, skills, gpa, pseudo})
}
