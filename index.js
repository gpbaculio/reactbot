const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 5000

app.use(bodyParser.json())

const clientDir = `client/${process.env.NODE_ENV === 'production' ? 'build' : 'public'}`

const staticPath = path.join(__dirname, clientDir);
app.use(express.static(staticPath));

const publicPath = path.join(__dirname, `${clientDir}/index.html`);
console.log('publicPath ', publicPath)
app.get('/*', (_req, res) => res.sendFile(publicPath));

require('./routes/dialogFlowRoutes')(app)

app.listen(PORT, () => {
  console.log(`PROJECT RUNNING ON PORT: ${PORT}`)
})