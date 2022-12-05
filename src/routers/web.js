const express = require("express")
const recivingController = require("../controller/recivingController")
const loginController = require("../controller/loginController")
const passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
const initPassportLocal = require('../controller/auth/passport');
let router = express.Router();

const routerInit = (app) => {
    app.use(passport.initialize());
    app.use(passport.session()); 
    router.get('/login',loginController.checkNotAuthenticated,loginController.show) 
    router.post('/logout', loginController.logout)    
    router.post('/login',loginController.checkNotAuthenticated ,passport.authenticate('local',{
        failureRedirect: "/login",
        successRedirect: "/",
        
      }));
    router.get('/',loginController.checkAuthenticated,recivingController.getIndexPage)    
    router.get('/create-reciving-room', recivingController.create)    
    return app.use('/', router)
}
module.exports = routerInit