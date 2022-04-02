require('dotenv').config();
import { response, Router } from 'express';
import passport from 'passport';
import airtable from 'airtable';
import * as local from 'passport-local';
import bcrypt from 'bcrypt';

const localStrategy = local.Strategy;
const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const airtableRouter = Router();


airtableRouter.get('/', (req, res, next) => {
    res.sendStatus(200)
})


airtableRouter.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
      if(error) {
          console.log("Error: " + error);
      } else if (!user) {
          // invalid username or password
          console.log(info.message);
          res.send("Failed")
      } else {
          req.login(user, function(err) {
              if (err) { return next(err); }
              console.log("Successfully logged in");
              res.send("Success")
            });
      }
    })(req, res, next);
  });

airtableRouter.post('/application_status', (req, res, next) => {
    //console.log('what is this ' + JSON.stringify(req.body))
    const passphrase = req.body.passphrase;
    
    let get_record_id = new Promise((resolve,reject) => {
        let record_idx = null;
        
        base('Human Readable Passphrases').select({
            maxRecords: 1,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage){
            records.forEach(function(record){
                if(record.get('Passphrase') == passphrase){
                    record_idx = record.get('FR Record ID')
                    console.log("record id: " + record_idx)
                }
            })
    
            fetchNextPage();
    
        }, function done(err){
            if(err) {console.log(err); return}
            resolve(record_idx)
        });
        


    })

    get_record_id
    .then((record_idx)=>{
      
        base('2021 Form Responses').select({filterByFormula: `{BRF 2021 Application Record ID} = '${record_idx}'`}).firstPage((err, records)=>{

            if(err){
                console.log("error: " + err);
                res.sendStatus(404)
                return;
            }else if (records.length == 1){
                console.log(records[0].fields['BRF Application Stage'])
                res.send(records[0].fields['BRF Application Stage']);  
            }else{
                console.log("error either too many records, or no record found")
                res.sendStatus(404);
            }
             
        })
       
    })
     
})

passport.serializeUser(function(user, callback) {
    callback(null, user);
  });
  
passport.deserializeUser(function(user, callback) {
callback(null, user);
});


passport.use(
    new localStrategy(
      { usernameField: "username", passwordField: "password" },
      function (username, password, done) {
        base("Authentication")
          .select({ filterByFormula: `Username = "${username}"` })
          .firstPage((err, records) => {
            if (err) {
              return done(null, false, {
                message: "Could not connect to Airtable",
              });
            }
            if (records.length == 0 || records.length > 1) {
              return done(null, false, { message: "User not found" });
            }
            bcrypt.compare(
              password,
              records[0].fields.Password,
              function (err, res) {
                if (err) {
                  console.log("There was an error validating the password");
                  return done(err);
                } else if (res) {
                  // successful match
                  return done(null, records);
                } else {
                  // bad password
                  return done(null, false, { message: "Incorrect Password" });
                }
              }
            );
          });
      }
    )
  );

export default airtableRouter;