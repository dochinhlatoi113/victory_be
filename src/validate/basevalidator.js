const {check, validationResult  } = require('express-validator');
const db = require("../models/index")

let validateDepartment = (req,res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()){
   
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/department/create.handlebars", { extractedErrors})
   }
   next()
}

let checkRegisterUser = (req,res, next) => {
   const errors = validationResult(req);
   
   if (!errors.isEmpty()){
   
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
     return  res.render("../views/group/user/create.handlebars", { extractedErrors})
   }
   next()
}

let checkUserPermission = async(req,res, next) => {
  
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      const extractedErrors = []
      errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
   
      let listsUserPermission = await db.user_permission.findAll({

     });
 
     let listsUser = await db.Admin.findAll({
 
     })
 
     let listsPermissions = await db.permissions.findAll({
 
     })
     let listsDepartments = await db.departments.findAll({
 
     })
 
     data = {
         listsUser: listsUser,
         listsUserPermission,
         listsPermissions: listsPermissions,
         listsDepartments: listsDepartments,
         message: req.flash('message'),
         messageErr: req.flash('messageErr'),   
         extractedErrors:extractedErrors
     }
     return res.render("../views/group/user-permission/create.handlebars", { data })
   }
   next()
}
let checkvalidate = {
  validateDepartment: validateDepartment,
  checkRegisterUser:checkRegisterUser,
  checkUserPermission:checkUserPermission
};

module.exports = {checkvalidate};
