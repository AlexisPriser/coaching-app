const db = require('../config/db.config.js');
const config = require('../config/config.js');
const ROLEs = config.ROLEs;
const User = db.utilisateur;
 
checkDuplicateUserNameOrEmail = (req, res, next) => {
  // -> Check Username is already in use
  User.findOne({
    where: {
      nom: req.body.nom,
      prenom: req.body.prenom
    }
  }).then(user => {
    if (user) {
      res.status(400).send("Fail -> Username is already taken!");
      return;
    }
 
    // -> Check Email is already in use
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send("Fail -> Email is already in use!");
        return;
      }
 
      next();
    });
  });
}
 /*
checkRolesExisted = (req, res, next) => {
  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
      res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
      return;
    }
  }
  next();
}*/
 
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
//signUpVerify.checkRolesExisted = checkRolesExisted;
 
module.exports = signUpVerify;

/*
{"auth":true,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI5OTgwNzQyLCJleHAiOjE2MzAwNjcxNDJ9.ge2f3sAR7IbELWzUuB49uC_mWHm7R6cckOaJELk6pGE","username":"tom","authorities":["ROLE_ADMIN"]}

{
  "firstname":"Thomas",
  "lastname":"Johnson",
  "username":"tom",
  "email":"tom@gmail.com",
  "roles":["admin"],
  "password":"123456789"
}

{
    "firstname":"Dan",
    "lastname":"Dan",
    "username":"dan",
    "email":"dan@gmail.com",
    "roles":["user","pm"],
    "password":"123456789"
}

{
    "firstname":"Bob",
    "lastname":"Builder",
    "username":"bob",
    "email":"bob@gmail.com",
    "roles":["user"],
    "password":"123456789"
}
*/