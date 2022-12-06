const {check } = require('express-validator');


const schema = [
    check('name', 'First Name is required').notEmpty()
  ];
module.exports = {
    schema
}
      