const {check } = require('express-validator');
const db = require('../models');
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

const checkCustomerContract = [
  check('customer').notEmpty().withMessage('account is required '),

];

const checkExistCustomerPhone = [
  check('phone').notEmpty().withMessage('phone must be not null')
.custom((value, {req, loc, path}) => {
    return db.customers.findOne({
        where: {
            phone: req.body.phone,
        }
    }).then(user => {
        if (user) {
            return Promise.reject('customer already in use');
        }
    });
})

]
module.exports = {
    schema,checkRegisterUser,checkUserPermission,checkCustomerContract,checkExistCustomerPhone
}
      