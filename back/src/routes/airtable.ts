require('dotenv').config();
import { Request, response, Router } from 'express';
import passport, { session } from 'passport';
import airtable from 'airtable';
import * as local from 'passport-local';
import bcrypt from 'bcrypt';
import async from 'async';
import nodemailer from 'nodemailer';
import { isConstructorDeclaration, isExpressionStatement, isImportEqualsDeclaration } from 'typescript';


const localStrategy = local.Strategy;
const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const airtableRouter = Router();
const emailTokenValidTimeInSeconds = 300;

interface UserToken {
  token: number;
  tokenCreationTime: number;
}

let userTokens = new Map<string, UserToken>();

airtableRouter.get('/', (req, res, next) => {
  res.sendStatus(200)
})

airtableRouter.post('/email', (req, res, next) => {
  const token = Math.floor(Math.random() * 900000) + 100000;
  const tokenCreationTime = Date.now();
  const userEmail = req.body.userEmail;

  let userToken: UserToken = {
    token: token,
    tokenCreationTime: tokenCreationTime,
  };

  userTokens.set(userEmail, userToken);

  const subjectMessage = 'Account Verification';
  const bodyMessage = 'Verification code: ' + token;

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASS
    }
  });

  const MAIL_INFO  = {
    to: userEmail,
    from: process.env.NOREPLY_EMAIL,
    subject: subjectMessage,
    text: bodyMessage 
  };

  smtpTransport.sendMail(MAIL_INFO, function(err) {});

  res.sendStatus(200);
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
    const fields = {
      status: "",
      description: "",
    };
    let regex = new RegExp('^([0]?[1-9]|[1][0-2])[./]([0]?[1-9]|[1|2][0-9]|[3][0|1])[./]([0-9]{4})$')
    if(req.body.DOB){
      if(!regex.test(req.body.DOB)){
        res.sendStatus(404).end();
        return; 
      }

    }
    // if logged in
    if(req.user){
      base('User Data').find(req.user[0].fields["User Data Record ID"], (err, record) => {
        if(record.fields['FR Record ID'] != undefined) {
          base('2021 Form Responses').select({
            fields: [
              "PWA Status",
              "PWA Status Description"
            ],
            filterByFormula: `{BRF 2021 Application Record ID} = "${record.fields['FR Record ID']}"`
          }).firstPage((err, records1) => {
            if(err) { console.error(err); return; }
            if(records1.length != 1) { 
              res.sendStatus(404).end();
              return; 
            }
            fields.status = records1[0].fields['PWA Status'];
            fields.description = records1[0].fields['PWA Status Description'];
            res.write(JSON.stringify(fields));
            res.end();
          });
        }
        else {
          res.sendStatus(404).end();
          return;
        }
      });
    }

    // if not logged in
    else{
      base('2021 Form Responses').select({
        fields: ["Applicant First Name", "Applicant Last Name", "PWA Status", "PWA Status Description"],
        // Birthdate is expecting mm/dd/yyyy with leading zeros stripped
        filterByFormula: `AND(
          {Applicant First Name} = '${req.body.firstName}', 
          {Applicant Last Name} = '${req.body.lastName}',
          {Birthdate} = '${req.body.DOB}'
        )`
      }).firstPage(function(err, records) {
        if(err) { console.error(err); return; }
        if(records.length > 1) { 
          console.error("More than one record return from application status check"); 
          res.sendStatus(404);
          return; 
        }
        if(records.length < 1) { 
          res.sendStatus(404);
          return; 
        }
        fields.status = records[0].fields['PWA Status'];
        fields.description = records[0].fields['PWA Status Description'];
        res.write(JSON.stringify(fields));
        res.end();
      });
    }
});

airtableRouter.get("/isLoggedIn", function (req, res, next) { 
  if (req.user) {
    res.send(req.user[0].fields.Username);
  } else {
    res.send("False");
  }
});

airtableRouter.get('/signout', function (req, res, next) { 
  req.logout()
  res.clearCookie("connect.sid").send("Success")
});




airtableRouter.post("/getInfo", function (req, res) {
  if(req.body.userName == undefined){
    res.sendStatus(404).end();
    return;
  }

  if (!req.user) {
    res.sendStatus(404).end();
    return
  }
  
  const userName = req.user[0].fields.Username
  if (userName === null || userName !== req.body.userName) {
    res.sendStatus(404).end();
    return;
  }

  try {

    const fields = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailAddress: "",
      contactMethod: "",
      paymentMethod: "",
    };
    base("Authentication")
      .select({ filterByFormula: `{Username} = "${userName}"` })
      .firstPage((err, records) => {
        if (err) console.error(err);
        if (records.length != 1)
          res.status(401).send({ error: "No such user exists" });
        const recordID = records[0].fields["User Data Record ID"];
        base('User Data')
        .find(recordID, (err, record) => {
          if(record.fields['FR Record ID'] != undefined && (record.fields['First Name'] == undefined || record.fields['Last Name'] == undefined)){
            base('2021 Form Responses').select({
              fields: [
                "Applicant First Name",
                "Applicant Last Name",
                "Applicant Phone",
                "Applicant Mailing Address",
                "Applicant Email",
                "Preferred Contact Method"
              ],
              filterByFormula: `{BRF 2021 Application Record ID} = "${record.fields['FR Record ID']}"`
            }).firstPage((err, records1) => {
              if(err) { console.error(err); return; }
              if(records1.length < 1) { 
                res.sendStatus(404).end();
                return; 
              }
              base('User Data').update([
                {
                  "id": recordID,
                  "fields": {
                    "First Name": records1[0].fields['Applicant First Name'],
                    "Last Name": records1[0].fields['Applicant Last Name'],
                    "Phone Number": records1[0].fields['Applicant Phone'],
                    "Mailing Address": records1[0].fields['Applicant Mailing Address'],
                    "Email Address": records1[0].fields['Applicant Email'],
                    "Preferred Contact Method": records1[0].fields['Preferred Contact Method']
                  }
                }
              ], function(err, records1) {
                if(err) {
                  console.error(err);
                  return;
                }
              });
              fields.firstName = records1[0].fields['Applicant First Name'];
              fields.lastName = records1[0].fields['Applicant Last Name'];
              fields.phoneNumber = records1[0].fields['Applicant Phone'];
              fields.address = records1[0].fields['Applicant Mailing Address'];
              fields.emailAddress = records1[0].fields['Applicant Email'];
              fields.contactMethod = records1[0].fields['Preferred Contact Method'];
              res.send(JSON.stringify(fields)).end();
            });
          } else if(record.fields['FR Record ID'] != undefined && record.fields['First Name'] != undefined){
            fields.firstName = record.fields["First Name"]
            fields.lastName = record.fields["Last Name"]
            fields.phoneNumber = record.fields["Phone Number"];
            fields.address = record.fields["Mailing Address"];
            fields.emailAddress = record.fields["Email Address"];
            fields.contactMethod = record.fields["Preferred Contact Method"];
            res.send(JSON.stringify(fields)).end();
          } else {
            res.sendStatus(404).end();
            return;
          }
          //res.end();
        });
      });
  } catch (err) {
    console.error(err);
    //res.end();
    throw err;
  }
});



airtableRouter.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const token = req.body.token;
  async.waterfall ([
    // Should probably check if the email is already in use.
    // This will already be checked by frontend but the request
    // could come from elsewhere technically.

    // Check for a matching token
    function(done){
      console.log("Current: " + Date.now() + " Token: " + userTokens.get(email).tokenCreationTime)
      if(userTokens.get(email).tokenCreationTime + (emailTokenValidTimeInSeconds * 1000) < Date.now()){
        done("Token is expired");
      }
      else if(token != userTokens.get(email).token){
        done("Token doesn't match");
      }
      else done(null);
    },

    // hash the new user password
    function(done) {
      bcrypt.hash(password, Number(process.env.SALT), function(err, hash) {
        if (err) {
          done(err);
        }
        else {
          done(err, hash);
        }
      });
    },
    // make sure the user does not already exist
    function(hashed_pw, done) {
      base('Authentication').select({filterByFormula: `Username = "${username}"`}).firstPage((err, records) => {
        if (err) {
          console.error(err);
        }
        else if (records.length == 0) {
          done(err, hashed_pw);
        }
        else {
          done("User already exists");
        }
      });
    },

    // Find Form Responses record if it exists
    function(hashed_pw, done){
      base('2021 Form Responses').select({filterByFormula: `{Applicant Email} = "${email}"`})
      .firstPage((err, records) => {
        if(err){
          console.error(err);
          done(err);
        }
        else if(records.length < 1){
          done(null, hashed_pw, null);
        }
        else{
          done(null, hashed_pw, records[0].fields["BRF 2021 Application Record ID"]);
        }
      });
    },

    // create the record in the User Data table and associate it with the Auth table
    function(hashed_pw, fr_record_id, done) {
      base('User Data').create([
        {
          fields: {
            "Email Address" : email,
            "FR Record ID": fr_record_id
          }
        }
      ], function(err, record_new) {
        done(err, hashed_pw, record_new[0].getId());
      });
    },

    // create the new user record in Authentication table 
    function(hashed_pw, user_data_rid, done) {
      base('Authentication').create([
        {
          "fields": {
            "Username": username,
            "Password": hashed_pw,
            "User Data Record ID": user_data_rid
          }
        }
      ], function(err, record_new){
        done(err);
      });
    },

    function(done){
      console.log("Account creation for " + username + " successful");
      res.send("Success");
    }
    
  ], function(err) {
    if (err) {
      console.error(err);
      res.send("Failed");
    }
  });
});



airtableRouter.post('/update_password', function(req, res, next) {
  const username =  req.user[0].fields.Username;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  const new_password_verify = req.body.new_password_verify;
  
  // get user
  base('Authentication').select({filterByFormula: `Username = "${username}"`}).firstPage((err, records) => {
    if (err) {
      console.error(err)
    };
    if (records.length == 0 || records.length > 1) {
      console.log("User Does Not Exist")
      res.send("Failed")
    };
    // get record id and old password hash from user records
    const record_id = records[0].getId()
    const hashed_password = records[0].fields.Password
    // compare input old password to current password
    bcrypt.compare(old_password, hashed_password, function(err, hash_res) {
      if (err) {
        console.error(err)
      }
      else if (hash_res) {
        // old password is a match, hash and compare new password
        // before assigning
        bcrypt.hash(new_password, 10, function(err, hash) {
          // compare both entries for new password to ensure no user typos
          bcrypt.compare(new_password_verify, hash, function(err, res_verify) {
            if (err) {
              console.error(err)
            }
            else if (res_verify) {
              // both new passwords match, new password hashed, update user password
              base('Authentication').update([{'id': record_id, 'fields': {'Password': hash},}], function(err, update_record) {
                if (err) {
                  console.error(err)
                };
                console.log("New Password Updated")
                res.send("Success")
                // redirect user to logged in page? or somewhere?
              })
            }
            else {
              console.log("New passwords do not match each other")
              res.send("Failed")
            }
          })
        })
      }
      else {
        console.log("Old Password does not match")
        res.send("Failed")
      }
    })
  });
});

airtableRouter.post("/update", function (req, res) {
  

  console.log("what is this: " + JSON.stringify(req.body[0].value));

  if (!req.user) {
    res.end();
    return
  }
  const userName = req.user[0].fields.Username
  console.log("userName: " + userName);
  if (userName !== req.body[0].value || userName === null) {
    res.end();
    return;
  }


  
  try {
    const fields = {
      "First Name": "",
      "Last Name": "",
      "Phone Number": "",
      "Mailing Address": "",
      "Email Address": "",
      "Preferred Contact Method": "",
     
    };
    let {
      userName,
      firstName,
      lastName,
      ...fieldsToChange
    } = req.body.reduce(
      (acc, field) => ({ [field.name]: field.value, ...acc }),
      {}
    );
    console.log("what is first: " + firstName)
    console.log('what is last: ' + lastName)

    console.log("even though this is empty: " + JSON.stringify(fieldsToChange));
    fieldsToChange.Name = `${firstName} ${lastName}`;
    console.log("splitting hairs: " + fieldsToChange.Name.split(' ')[0]);
    fieldsToChange.firstName = `${firstName}`;
    fieldsToChange.lastName = `${lastName}`;
    for (const field in fieldsToChange) {
      switch (field) {
        case "firstName":
          fields["First Name"] = fieldsToChange[field];
          break;
        case "lastName":
          fields["Last Name"] = fieldsToChange[field];
          break;
        case "address":
          fields["Mailing Address"] = fieldsToChange[field];
          break;
        case "phoneNumber":
          fields["Phone Number"] = fieldsToChange[field];
          break;
        case "emailAddress":
          fields["Email Address"] = fieldsToChange[field];
          break;
        case "contactMethod":
          fields["Preferred Contact Method"] = fieldsToChange[field];
          break;
      }
    }
    console.log("what is the name " + userName);
  
    base("Authentication")
    .select({ filterByFormula: `{Username} = "${userName}"` })
    .firstPage((err, records) => {
      
      if (err) console.error(err);
   
      if (records.length != 1)
        return res.status(403).send({ error: "Unauthorized user" });
      
      const recordID = records[0].fields["User Data Record ID"];
     
      base('User Data')
      .find(recordID, (err, record) => {
        console.log("what is the name " + JSON.stringify(fields));
        console.log("done with that");

        console.log('what is the record id: ' + recordID)
        
        base("User Data").update([
          {
            "id": recordID.toString(),
            "fields": fields
          }

        ], function(err, records){
          if(err){
            console.error(err);
            return;
          }
          console.log("were not fucked yet")

        });


      })
      });
  } catch (err) {
   
    console.log(err);
    throw err;
  }
});



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
