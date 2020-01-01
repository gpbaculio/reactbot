const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 5000

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)

// test route

app.get('/', (req, res) => {
  res.send({ 'hello': 'route check' })
})

app.listen(PORT)