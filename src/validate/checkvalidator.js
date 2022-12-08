const {check } = require('express-validator');
const schema = [
    check('name', 'First Name is required').notEmpty()
  ];

const checkRegisterUser = [
  check('email').notEmpty().withMessage('email is required ha'),
 
  check('password').notEmpty().withMessage('password is required ss'),
  
];
module.exports = {
    schema,checkRegisterUser
}
      