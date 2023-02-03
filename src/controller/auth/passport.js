const db = require('../../models/index')
const passport = require('passport');
const passportLocal = require('passport-local')
let LocalStrategy = passportLocal.Strategy;


 module.exports =  passport.use('local',new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, email, password, done)=> {
    try {
        $arrUserInfo = "";
        const user = await db.user_permission.findOne({ 
              include:[{
                model:db.departments
            },
            {
                model:db.permissions
            },
            {
                model:db.Admin
            }],
              where: { 
                '$Admin.email$': req.body.email 
          
                } 
        });
     
          if (user.Admin.email === req.body.email && user.Admin.password === req.body.password) {
            return done(null, {
              email,
              departmentsId : user.department.id,
              departments:user.department.name,
              permission:user.permission.name,
              userId:user.userId,
              active: true
          })          
          } else {
            return done(null, false)
          }       
    } catch (error) {
      console.log(error);
      return done(null, false,{message:'data not '});
    }
  }));


  

  passport.serializeUser(function(user, done) {
    done(null, user);
    
  });
  
  passport.deserializeUser(function(user, done) {
     done(null, user);
     
  });
