require('dotenv').config()
const express = require('express')
const cors = require('cors')
const message = require('./src/helper/message')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.listen(PORT, () => message(PORT))