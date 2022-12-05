const {check, validationResult } = require('express-validator');

let validateDepartment = (req,res) => {
 check('name', 'username does not Empty').not().isEmpty()
 const err = validationResult(req) 
 if(!err.isEmpty()){
    return res.json(err.array())
 }
}

let validateLogin = () => {
  return [ 
    check('user.email', 'Invalid does not Empty').not().isEmpty(),
    check('user.email', 'Invalid email').isEmail(),
    check('user.password', 'password more than 6 degits').isLength({ min: 6 })
  ]; 
}

let checkvalidate = {
  validateDepartment: validateDepartment,
  validateLogin: validateLogin
};

module.exports = {checkvalidate};
