const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.json("middleware error 1")
        }
        const decoded = jwt.verify(token, process.env.AUTH_KEY)
        req.user = decoded 
        next()
    } catch(e) {
        return res.json(e)
    }
};