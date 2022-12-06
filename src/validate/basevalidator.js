const {check, validationResult  } = require('express-validator');

let validateDepartment = (req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  
};

module.exports = {checkvalidate};
