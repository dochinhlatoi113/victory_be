const {check, validationResult } = require('express-validator');

let validateDepartment = (req,res) => {
    let name = req.body.name;  
    req.checkBody('name', 'Name is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
       req.session.errors = errors;
       req.session.success = false;
       res.send('error');
    }
    else{
       req.session.success = true;
       res.send('oke');
    }
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  
};

module.exports = {checkvalidate};
