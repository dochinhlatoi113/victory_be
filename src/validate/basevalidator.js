const {check, validationResult  } = require('express-validator');

let validateDepartment = (req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      let arrMessErr;
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/department/create.handlebars", { extractedErrors})
   }
   next()
}

let checkRegisterUser = (req,res, next) => {
   const errors = validationResult(req);
   
   if (!errors.isEmpty()){
      let arrMessErr;
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/user/create.handlebars", { extractedErrors})
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  checkRegisterUser:checkRegisterUser
};

module.exports = {checkvalidate};
