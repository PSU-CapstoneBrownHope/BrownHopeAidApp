import routes from './index';
import express from 'express';
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.use(routes)
const server = app.listen(port,() => {

  console.log("application live on port " + port);

});

export default server;

//module.exports = server;