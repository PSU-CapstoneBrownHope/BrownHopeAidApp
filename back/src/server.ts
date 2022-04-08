import routes from './index';
import express from 'express';
import passport from 'passport';
import cookiePraser from 'cookie-parser';

import session from 'express-session';

const fileStore = require('session-file-store')(session)

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiePraser());
app.use(session({
  'store': new fileStore({ttl:600}),
  'secret': 'gfr456$^(%$jfkderfg',
  'resave': true,
  'saveUninitialized': true

}))



app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.use(routes)
const server = app.listen(port,() => {

  console.log("application live on port " + port);

});

export default server;

//module.exports = server;