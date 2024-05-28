require('dotenv').config()
const express = require('express')
const models = require('./models/tmaker_models.js')
const PORT = 5000
const cors = require('cors')
const sequelize = require('./db.js')
const app = express()
const rout = require('./routes/routers.js')


app.use(express.json())
app.use(cors())
app.use('/api', rout)

const start = async() => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server started'))
    } catch (e) {
        console.log(e)
    }
}

start()