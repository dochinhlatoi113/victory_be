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
      // {"errors":[{"value":"","msg":"email is required","param":"email","location":"body"},{"value":"","msg":"password is required","param":"password","location":"body"}]}
      return  res.redirect("/group/user/create",errors)
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  checkRegisterUser:checkRegisterUser
};

module.exports = {checkvalidate};
