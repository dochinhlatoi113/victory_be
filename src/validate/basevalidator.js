const {check, validationResult  } = require('express-validator');

let validateDepartment = (req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
   }
   next()
}

let checkRegisterUser = (req,res, next) => {
   const errors = validationResult(req);
   
   if (!errors.isEmpty()){
      let data = 1;
      let arrMessErr;
    
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
      console.log(extractedErrors)
    
      // {"errors":[{"value":"","msg":"email is required","param":"email","location":"body"},{"value":"","msg":"password is required","param":"password","location":"body"}]}
      return   res.render("../views/group/user/create.handlebars", { errors: errors})
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  checkRegisterUser:checkRegisterUser
};

module.exports = {checkvalidate};
