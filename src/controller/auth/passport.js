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
      const userPermissions = await db.user_permission.findAll({ 
        include:[
        {
          model:db.Admin
        } , 
        {
          model: db.departments
        }, {
          model: db.permissions
        }],
        where: { 
          '$Admin.email$': req.body.email,
          '$Admin.password$': req.body.password 
        } 
      });
      
      const permissions = userPermissions.map((userPermission) => {
        return userPermission.permission.name.trim();
      });
      
      return done(null, {
        email,
        departmentsId : userPermissions[0].department.id,
        departments: userPermissions[0].department.name,
        permission: permissions,
        userId: userPermissions[0].userId,
        active: true
      });
        
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
