const {Project, Project_Skill, User_Projects, Skill, User, Student, Team, Student_Team} = require('./../models/tmaker_models')


class ProjectController {
    async createProject(req, res) {
        const {_name} = req.body
        const {description} = req.body 
        const {user_id} = req.body
        const {skills} = req.body 
        const project = await Project.create({ _name, description }).then((proj) => {
                    User_Projects.create({ user_id: user_id, project_id: proj.project_id }).then((userProject) => {
                        skills.forEach((skillId) => {
                          Project_Skill.create({ project_id: proj.project_id, skill_id: skillId })
                        });
                      });
                      return res.json(proj.project_id)
                  })
          
    }

    async getAllProjects(req, res) {

      // на выходе: 
        // program 
        // project_name
        // project_desc
        // project_skills
        // student_group
        // student_year
        // student_names 

        const {user_id}  = req.query
        User.findByPk(user_id, {
          include: [{
            model: Project,
            attributes: ['_name', 'description'],
            include: [
              {
                model: Skill,
                attributes: ['skill_name'],
                through: { attributes: [] }
              }, 
              {
                model: Team,
                attributes: ['team_id'],
                
              }
            ]
          }]
        }).then(user => {
           const user1 = []
           for (let t = 0; t < user.projects.length; t++) {
              user1.push(
                {project_name: user.projects[t]._name,
                  project_desc: user.projects[t].description, 
                  project_skills: user.projects[t].skills.map(sk => sk.skill_name),
                   team: user.projects[t].teams.map(team => team.team_id).length > 0 ? user.projects[t].teams.map(team => team.team_id) : null
                   //.map(sk => sk.team_id).length > 0 ?
                //   (Team.findAll({
                //     where: { team_id: 11 },
                //     include: [{
                //         model: Student,
                //         attributes: ['student_id']
                //     }]
                // }) ): null
                })
           }
           return res.json(user1)
        }).catch(err => {
          console.error(err);
        });
    }
}

module.exports = new ProjectController()