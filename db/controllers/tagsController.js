const {Skill, Student_Skill, Student} = require('./../models/tmaker_models')
const Sequelize = require('./../db');
const { where } = require('sequelize');


// Модель Skill

class TagsController {
    async getAll(req, res) {
        const tags = await Skill.findAll()
        return res.json(tags) 
    }

    async getSixPopular(req, res) {
        try {
            var topSkills = await Student_Skill.findAll({
              attributes: ['skill_id', [Sequelize.fn('COUNT', 'skill_id'), 'count']],
              group: ['skill_id'],
              order: [[Sequelize.literal('count'), 'DESC']],
              limit: 6,
              raw: true,
              nest: true,
            });
            var skill_name = topSkills.map(sk => sk.skill_id)
            skill_name = await Skill.findAll( {
                where: {
                    skill_id: skill_name
                }
        })
            return res.json(skill_name);
          } catch (error) {
            console.error('Ошибка при получении навыков:', error);
          }
    }

    async createTag(req, res) {
      const skill = await Skill.max('skill_id').then(id => id+1)
      const {skill_name} = req.body 
      const tag = await Skill.create({skill_id: skill, skill_name : skill_name}).then(() => {return res.status(200).json({"msg": "good"})})
    }

}

module.exports = new TagsController() 