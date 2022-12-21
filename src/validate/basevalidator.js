const {check, validationResult  } = require('express-validator');
const db = require("../models/index")

let validateDepartment = (req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
   
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/department/create.handlebars", { extractedErrors})
   }
   next()
}

let checkRegisterUser = (req,res, next) => {
   const errors = validationResult(req);
   
   if (!errors.isEmpty()){
   
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/user/create.handlebars", { extractedErrors})
   }
   next()
}

let checkUserPermission = async(req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
      res.cookie("err", extractedErrors, { httpOnly: true });
      return res.redirect("/group/user-permission/create")
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  checkRegisterUser:checkRegisterUser,
  checkUserPermission:checkUserPermission
};

module.exports = {checkvalidate};
