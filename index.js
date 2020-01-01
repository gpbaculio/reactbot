const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 5000

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)

app.listen(PORT)