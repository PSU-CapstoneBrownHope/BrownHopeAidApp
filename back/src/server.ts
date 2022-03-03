import express from "express";

const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.sendStatus(200)
})


app.listen(port, () => {
  console.log("server has been started on port: " + port)
})
