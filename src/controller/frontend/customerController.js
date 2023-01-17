const db = require("../../models/index")
const passport = require('passport');
const { Op } = require("sequelize");
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
const jwt = require("jsonwebtoken");
require('dotenv').config();

let register = async (req, res) => {
 let list = await db.customer_accounts.findOne({
        where: {
          account:req.body.account,
          password:req.body.password
        }
    })
    if (list) {
      const token = jwt.sign({ list }, process.env.SESSION_SECRET, {
        expiresIn: 100000,
      });
        res.json({ msg: 'ok', token: token });
    } else {
        res.status(401).json({ msg: 'ko co' });

    }
}

let show = async(req,res) => {
  return res.json(req.user)
}
module.exports = {
  register, show,
}