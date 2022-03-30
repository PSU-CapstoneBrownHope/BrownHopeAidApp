const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.sendStatus(200)
})



module.exports = app