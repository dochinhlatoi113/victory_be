const db = require('../../models/index')
const passport = require('passport');
const passportLocal = require('passport-local')
let LocalStrategy = passportLocal.Strategy;


 module.exports =  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, email, password, done)=> {
    try {
        $arrUserInfo = "";
        const user = await db.Admin.findOne({ where: { email: req.body,email } });
          if (user.email === req.body.email && user.password === req.body.password) {
            return done(null, {
              email,
              password,
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
    done(null, user.email);
  });
  
  passport.deserializeUser(function(user, done) {
     done(null, user);

  });
