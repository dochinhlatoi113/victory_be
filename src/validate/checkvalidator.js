const {check } = require('express-validator');
const schema = [ 
    check('name').notEmpty().withMessage('field is required '),
  ];

const checkRegisterUser = [
  check('email').notEmpty().withMessage('email is required '),
  check('password').notEmpty().withMessage('password is required '),
];

const checkUserPermission = [
  check('user').notEmpty().withMessage('account is required '),
  check('department').notEmpty().withMessage('required '),
  check('permissions').notEmpty().withMessage('permission is required'),
];
module.exports = {
    schema,checkRegisterUser,checkUserPermission
}
      