const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 5000

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)

const clientRootDir = process.env.NODE_ENV === 'production' ? 'public' : 'build'

const staticPath = path.join(__dirname, 'client', clientRootDir);
app.use(express.static(staticPath));

const publicPath = path.join(__dirname, 'client', clientRootDir, 'index.html');
app.get('/*', (_req, res) => res.sendFile(publicPath));

app.listen(PORT, () => {
  console.log(`PROJECT RUNNING ON PORT: ${PORT}`)
})