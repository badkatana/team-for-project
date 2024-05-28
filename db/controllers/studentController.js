const {Student, Team, Student_Team, Skill, Student_Skill, Program} = require('../models/tmaker_models')
const sequelize = require('./../db')
const { Op } = require('sequelize');

class StudentController {
    async getGroups(req, res) {
        const uniqueGroups = await Student.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('student_group')), 'uniqueGroups']],
            raw: true
          });
      
        return res.json(uniqueGroups.map(grade => grade.uniqueGroups));
    }

    async getYears(req, res) {
        let uniqueYears = await Student.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('student_year')), 'uniqueYears']],
            raw: true
        });
        uniqueYears = uniqueYears.map(year => year.uniqueYears)
        uniqueYears = uniqueYears.map(year => year.replace("-01-09", ""))
        return res.json(uniqueYears)
    }

    async getStudent(req,res) {
        const {team_id} = req.query
        Team.findOne({
            where: { team_id: team_id},
            include: [{
                model: Student,
                attributes: ['student_id', 'pseudo', 'student_group', 'student_year', 'average_score'],
                include : [
                    {
                        model: Skill,
                        attributes: ['skill_name']
                    }
                ]
            }]
        })
        .then(team => {
            const students = team.students.map(st => new Object({name: st.pseudo, gpa: st.average_score, year: st.student_year, skill: st.skills.map(sl => sl.skill_name)}))
            return res.json(students)
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
    }

    async createStudent(req, res) {
        const {surname, student_name, patronym, group, year, program_name, skills, gpa, pseudo} = req.body
        const sk = Skill.findAll({
            attributes: ['skill_id'],
            where: {
              skill_name: {
                [Op.in]: skills
              }
            }
          }).then(results => {
              const skillIds = results.map(result => result.skill_id)
                const program = Program.findAll({attributes: ['program_id']},{where:{ name: program_name}})
                const student = Student.create({ surname: surname, 
            student_id: undefined, 
            student_name : student_name, 
            student_year : year, 
            patronym : patronym,
            pseudo : pseudo,
            surname: surname,
            student_group : group,
            program_id : 1, 
            average_score : gpa }).then(stu => {
                skillIds.forEach(element => {
                    Student_Skill.create({student_id : stu.student_id, skill_id: element})})
                
                return res.status(200).json(stu.student_id)})});
    }

    async getAllStudents(req, res) {
        const students = await Student.findAll({include : [
            {
                model: Skill,
                attributes: ['skill_name']
            }, 
            {
                model: Program,
                attributes: ['name']
            }
         ]})
         .then(
            stu => {
            const st = stu.map(st => 
                new Object({student_surname: st.surname, 
                    student_name: st.student_name,
                    student_patronym: st.patronym,
                    student_group: st.student_group, 
                    pseudo: st.pseudo, 
                    student_id: st.student_id,
                    student_program: st._program.name,
                    student_year: st.student_year, 
                    gpa : st.average_score,
                    student_skills: st.skills.map(sl => sl.skill_name + " ")}))
                
                    return res.json(st)}
                    
        )
    }

    async updateStudent(req, res) {
        const {st_id, gpa, surname, name, patronym, year, group, program_name,pseudo} = req.body
        const program = await Program.findAll({where: {name: program_name}}).then(pr => pr.program_id)
        const student = await Student.update( 
            {pseudo: pseudo, 
             surname: surname, 
             student_name: name, 
             patronym: patronym,
             student_year: year, 
             student_group: group,
             average_score: gpa,
             program_id: program
            }, {where: {student_id: st_id}})
        return res.json(student)
    }

    async updateStudentsSkills(req, res) {
        const {skills, st_id} = req.body
        // Ваш массив строк
        
        // Находим все skill_id, где skill_name совпадает со строкой в массиве
        const sk = Skill.findAll({
          attributes: ['skill_id'],
          where: {
            skill_name: {
              [Op.in]: skills
            }
          }
        }).then(results => {
            const skillIds = results.map(result => result.skill_id)
            console.log(skillIds)
            Student_Skill.destroy({
                where: {
                  student_id: st_id
                }
              }).then(() => {
                console.log(skillIds)
                // Шаг 3: Создать новые записи в таблице Student_Skill с использованием найденных skill_id
                const newRecords = skillIds.map(skill_id => ({
                  student_id: st_id,
                  skill_id: skill_id
                }));

                console.log(newRecords)
            
                Student_Skill.bulkCreate(newRecords)
                  .then(() => {
                    return res.json('Записи успешно обновлены');
                  })
                  .catch(error => {
                    return res.json('Ошибка при создании новых записей:');
                  });
              }).catch(error => {
                return res.json('Ошибка при удалении записей из таблицы Student_Skill:');
              });
            }).catch(error => {
              return res.json('Ошибка при поиске skill_id:');
            });
        
    }}
        

module.exports = new StudentController() 