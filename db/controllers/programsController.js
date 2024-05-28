const {Program} = require('./../models/tmaker_models')

class ProgramController {
    async getAll(req, res) {
        const programs = await Program.findAll({raw: true, nest: true}).then(programs => programs.map(pro => pro.name));
        return res.json(programs)
    }
}

module.exports = new ProgramController() 