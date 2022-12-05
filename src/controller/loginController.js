const db = require('../models/index')
const passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const e = require('express');
let show = async (req, res) => {
    try {
        let data = await db.Admin.findAll();       
        res.render("../views/recivingLogin.handlebars",{layout: null,data:data})
    } catch (error) {
        console.log(error)
    }
}

let logout = (req, res) => {  
    req.session.destroy(function (err) {
        res.redirect('/login')
    });
    
};

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        console.log(">>>>Authenticated");
        return next();
      }    
      console.log("aaaa Not Authenticated");     
      // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
      return res.render("../views/recivingLogin.handlebars",{layout: null})

  }
  
  function checkNotAuthenticated(req, res, next) {
   
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
   
  }

module.exports = {
    show,logout, checkAuthenticated,checkNotAuthenticated
}