const db = require("../../../models/index")
var passport = require('passport');
const { Op } = require("sequelize");
var passportJWT = require('passport-jwt');
const { error } = require("winston");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

require('dotenv').config();
var jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SESSION_SECRET;
 passport.use('jwt',new JwtStrategy(jwtOptions, async function(payload, done,req,res) {
    let customer = await db.customer_accounts.findOne(
      {where:{
        id:payload.list.id,
      }}
    )
    if (!customer) {
      return done(null, false, {message: 'Incorrect password.'});
    } 
    return  done(null,customer)
  }));
 
