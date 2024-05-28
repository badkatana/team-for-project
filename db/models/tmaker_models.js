const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Student = sequelize.define('student', {
    student_id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    pseudo: {type: DataTypes.STRING(100)},
    email: {type: DataTypes.STRING(120)},
    surname: {type: DataTypes.STRING(30)},
    student_name: {type: DataTypes.STRING(30)},
    patronym: {type: DataTypes.STRING(30)},
    student_group: {type: DataTypes.INTEGER}, 
    student_year: {type: DataTypes.DATE}, 
    status: {type: DataTypes.BOOLEAN},
    average_score: {type: DataTypes.REAL}
}, 
{ timestamps: false, freezeTableName: true})

const Program = sequelize.define('_program', {
    program_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING(120)}
}, { timestamps: false, freezeTableName: true })

const Skill = sequelize.define('skill', {
    skill_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    skill_name: {type: DataTypes.STRING}
}, { timestamps: false, freezeTableName: true })

const User = sequelize.define('_user', {
    user_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, 
    email: {type: DataTypes.STRING, unique: true},
    _password: {type: DataTypes.STRING}, 
    role: {type: DataTypes.STRING} 
}, { timestamps: false, freezeTableName: true })

const Project = sequelize.define('project', {
    project_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    _name: {type: DataTypes.STRING}, 
    description: {type: DataTypes.STRING}
}, { timestamps: false, freezeTableName: true })

const Tutor = sequelize.define('tutor', {
    tutor_id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    surname: {type: DataTypes.STRING},
    _name: {type: DataTypes.STRING},
    patronym: {type: DataTypes.STRING}
}, { timestamps: false, freezeTableName: true })

const Team = sequelize.define('team', {
    team_id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true}
}, { timestamps: false, freezeTableName: true })

const Student_Skill = sequelize.define('student_skill', {student_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER}, { timestamps: false, freezeTableName: true })

const Student_Team = sequelize.define('student_team', {}, { timestamps: false, freezeTableName: true })
const Project_Skill = sequelize.define('project_skill', {}, { timestamps: false, freezeTableName: true })
const User_Projects = sequelize.define('user_projects', {}, { timestamps: false, freezeTableName: true })
const Tutor_Project = sequelize.define('tutor_project', {}, { timestamps: false, freezeTableName: true })


// связи 

Student.belongsToMany(Skill, {foreignKey: 'student_id', through: {model: Student_Skill} })
Skill.belongsToMany(Student, {foreignKey: 'skill_id',through: {model: Student_Skill}} )

Student.belongsToMany(Team, {foreignKey: 'student_id', through: Student_Team})
Team.belongsToMany(Student, {foreignKey: 'team_id',  through: Student_Team} )

Project.belongsToMany(Skill, {foreignKey: 'project_id', through: Project_Skill})
Skill.belongsToMany(Project, {foreignKey: 'skill_id', through: Project_Skill})

User.belongsToMany(Project, {foreignKey: "user_id", through: User_Projects})
Project.belongsToMany(User, {foreignKey: "project_id", through: User_Projects})

Tutor.belongsToMany(Project, {foreignKey: 'tutor_id', through: Tutor_Project})
Project.belongsToMany(Tutor, {foreignKey: 'project_id', through: Tutor_Project})


Program.hasMany(Student, {foreignKey: 'program_id'});
Student.belongsTo(Program, {foreignKey: 'program_id'}); 

Project.hasMany(Team, {foreignKey: 'project_id'}); 
Team.belongsTo(Project, {foreignKey: 'team_id'})


module.exports = {
    Student, User, Program, Project, Team, Tutor, Skill,
    Student_Skill, Student_Team, Project_Skill, 
    User_Projects, Tutor_Project
}