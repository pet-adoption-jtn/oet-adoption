const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)

app.listen(PORT, () => console.log('listening at port', PORT))