const jwt = require('jsonwebtoken');

module.export = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.json("middleware error 1")
        }
        const decoded = verify(token, process.env.AUTH_KEY)
        if (decoded.role != 'admin') {
            return res.status(403).json({"msg" : "нет доступа"})
        }
        req.user = decoded 
        next()
    } catch(e) {
        return res.status(403).json({"msg": "ошибка 2"})
    }
};