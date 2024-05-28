const {User, User_Projects, Project} = require('./../models/tmaker_models')
const Sequelize = require('./../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const e = require('express');

// admin - 2212tmaker
// user - cosinus13

const createJWT = (id, email, role) => {
    return jwt.sign({id, role, email}, process.env.AUTH_KEY, {expiresIn: '24h'})
}

class UserController {
    async getUser(req, res) {
        const {email} = req.query
        const user = await User.findOne({where: {email: email }})
        return res.json(user)
    }

    async registration(req, res) {
        const {email, pwd} = req.body 
        const user_find = await User.findAll({where:{ email: email}})
        if (!user_find) {
            return res.json({"msg": "similar email was found"})
        } else {
            const hashPwd = await bcrypt.hash(pwd, 5)
            const newUser = await User.create({email, _password: hashPwd, role: "user"})
            const token = createJWT(newUser.user_id, newUser.email, newUser.role)
            return res.json({token})
        }

    }
    
    async login(req, res) {
        const {email, pwd} = req.body
        const userFind = await User.findOne({where: {email}})
        if (!userFind) {
            return res.json({"msg": "user not found"})
        } else {
            let comparePwd = bcrypt.compareSync(pwd, userFind._password)
            if (!comparePwd) {
                return res.json({"msg": "pwd error"})
            }
            const token = createJWT(userFind.user_id, userFind.email, userFind.role)
            return res.json({token})
        }
    }

    async check(req, res, next) {
        const token = createJWT(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }

    async checkRole(req, res) {
        const {user_id} = req.query 
        const ud = await User.findOne({where: user_id}).then((yt) => { 
            if (yt.role == 'admin') {
                return res.json(true)
            } 
            else { 
                return res.json(false)
            }
        })
    }

    async getUserProjects(req, res) {

        const {user_id} = req.query
        const projects = await User_Projects.findAll({where: {user_id: user_id}})
        .then((pro) => 
            { Project.findAll({where: {project_id : pro.project_id}})})

        return res.json(projects)
    }

}

module.exports = new UserController() 