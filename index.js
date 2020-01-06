const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')


const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0-idcau.mongodb.net/reactbot?retryWrites=true&w=majority`
const PORT = process.env.PORT || 5000

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
require('./models/Registration');

const app = express()

app.use(bodyParser.json())

const clientDir = `client/${process.env.NODE_ENV === 'production' ? 'build' : 'public'}`

const staticPath = path.join(__dirname, clientDir);
app.use(express.static(staticPath));

const publicPath = path.join(__dirname, `${clientDir}/index.html`);
app.get('/*', (_req, res) => res.sendFile(publicPath));

require('./routes/dialogFlowRoutes')(app)

app.listen(PORT, () => {
  console.log(`PROJECT RUNNING ON PORT: ${PORT}`)
})