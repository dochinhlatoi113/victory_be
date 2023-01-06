const express = require("express")
const recivingController = require("../controller/recivingController")
const loginController = require("../controller/loginController")
const passport = require('passport');
const groupController = require('../controller/groupController')
const permissionController = require('../controller/permissionController')
const departmentController = require('../controller/departmentController')
const LocalStrategy = require('passport-local').Strategy;
const basevalidator = require("../validate/basevalidator")
const checkPermission = require('../controller/auth/checkPermissionController');
const checkValidate = require("../validate/checkvalidator")
const initPassportLocal = require('../controller/auth/passport') 
const userController = require("../controller/userController")
const categoryProgramController = require("../controller/categoryProgramController")
const contractController = require("../controller/contractController")
const qsController = require("../controller/qsController")
const salesController = require("../controller/salesController")
const customerProgramController = require("../controller/customerProgramController")
const userPermissionController = require("../controller/userPermissionController")
const uploadFile = require("../controller/uploadFile/file")
const uploadFileController = require("../../src/controller/uploadFile/uploadFileController")
const { check, body, validationResult } = require('express-validator')
const e = require("express");
let router = express.Router();

const routerInit = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  router.get('/login', loginController.checkNotAuthenticated, loginController.show)
  router.post('/logout', loginController.logout)
  // router.post('/login',loginController.checkNotAuthenticated ,passport.authenticate('local',{
  //     failureRedirect: "/login",
  //     successRedirect: "/",      
  //   }));
  router.post('/login', loginController.checkNotAuthenticated, passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), 
    checkPermission.checkPermssion
  );

  app.group("/reciving-room", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/',recivingController.getIndexPage)
    router.get('/create-reciving-room', recivingController.create)
    //program
    router.get('/program/',categoryProgramController.show)
    router.get('/program/create',categoryProgramController.create)
  })
  app.group("/group", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/', loginController.checkAuthenticated, groupController.show)
  })
  
  //group/permssion
  router.get('/group/permission', loginController.checkAuthenticated, permissionController.show)
  //group/department\
 
  app.group("/group/department", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/', loginController.checkAuthenticated, groupController.show)
    router.get('/create', loginController.checkAuthenticated, departmentController.create)
    router.get('/edit/:id', loginController.checkAuthenticated, departmentController.edit)
    router.post('/store', checkValidate.schema, basevalidator.checkvalidate.validateDepartment, loginController.checkAuthenticated, departmentController.store)
    router.post('/update/:id', loginController.checkAuthenticated, checkValidate.schema, basevalidator.checkvalidate.validateDepartment, departmentController.update)
    router.post('/delete/:id', loginController.checkAuthenticated, departmentController.destroy)
  })
  // router.get('/group/department/edit/:id',loginController.checkAuthenticated ,departmentController.edit)   

  //user 
  app.group("/group/user", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/', userController.show)
    router.get('/create', userController.create)
    router.post('/delete/:id', userController.destroy)
    router.get('/store', checkValidate.checkRegisterUser, basevalidator.checkvalidate.checkRegisterUser,function(res,req){
      return res.redirect("/group/user/")
    })
    router.post('/store', checkValidate.checkRegisterUser, basevalidator.checkvalidate.checkRegisterUser, userController.store)
  })


  //user permission
  app.group("/group/user-permission", (router) => {
    router.use(loginController.checkAuthenticated,function(req,res,next){
        if(req.user.departmentsId != 0) {
         return res.render("../views/error/error.handlebars",{layout: null})
        }
        next()
    })
    router.get('/', userPermissionController.show)
    router.get('/create', userPermissionController.create)
    router.get('/edit/:id&:userid', userPermissionController.edit)
    router.get('/store',function(req,res){
      return res.redirect("/group/user-permission/create")
    })
    router.post('/delete/:id', userPermissionController.destroy)
    router.post('/store',checkValidate.checkUserPermission, basevalidator.checkvalidate.checkUserPermission, userPermissionController.store)
    router.post('/update/',checkValidate.checkUserPermission, basevalidator.checkvalidate.checkUserPermission, userPermissionController.update)
  })
  // sales
  app.group("/sales", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('', loginController.checkAuthenticated, salesController.show)
    router.get('/create', loginController.checkAuthenticated, salesController.create)
    router.get('/edit/:id', loginController.checkAuthenticated, salesController.edit)
    router.post('/store',  basevalidator.checkvalidate.validateDepartment, loginController.checkAuthenticated, salesController.store)
    router.post('/update/:id', loginController.checkAuthenticated, checkValidate.schema, basevalidator.checkvalidate.validateDepartment, salesController.update)
    router.post('/delete/:id', loginController.checkAuthenticated, salesController.destroy)
  })
  
 // qs
 app.group("/qs", (router) => {
  router.use(loginController.checkAuthenticated)
  router.get('', loginController.checkAuthenticated, qsController.show)
  router.get('/create', loginController.checkAuthenticated, qsController.create)
  router.get('/edit/:id', loginController.checkAuthenticated, qsController.edit)
  router.post('/store', basevalidator.checkvalidate.validateDepartment, loginController.checkAuthenticated, qsController.store)
  router.post('/update/:id', loginController.checkAuthenticated, basevalidator.checkvalidate.validateDepartment, qsController.update)
  router.post('/delete/:id', loginController.checkAuthenticated, qsController.destroy)
})

 // category_program
 app.group("/category_program", (router) => {
  router.use(loginController.checkAuthenticated)
  router.get('/', loginController.checkAuthenticated, categoryProgramController.show)
  router.get('/create', loginController.checkAuthenticated, categoryProgramController.create)
  router.get('/edit/:id', loginController.checkAuthenticated, categoryProgramController.edit)
  router.post('/store',  basevalidator.checkvalidate.validateDepartment, loginController.checkAuthenticated, categoryProgramController.store)
  router.post('/update/:id', loginController.checkAuthenticated,  basevalidator.checkvalidate.validateDepartment, categoryProgramController.update)
  router.post('/delete/:id', loginController.checkAuthenticated, categoryProgramController.destroy)
})

 // customer
 app.group("/customer", (router) => {
  router.use(loginController.checkAuthenticated)
  router.get('/', customerProgramController.show)
  router.get('/create',  customerProgramController.create)
  router.get('/edit/:id',uploadFile.upload.array("files"), customerProgramController.edit)
  router.post('/store', uploadFile.upload.array("files") ,customerProgramController.store)
  router.post('/delete/medias/:idDelete', uploadFile.upload.array("files") ,customerProgramController.deleteMedias)
  router.post('/delete/links/:idDelete', uploadFile.upload.array("files") ,customerProgramController.deleteLinks)
  router.post('/update/:id/', uploadFile.upload.array("files"), customerProgramController.update)
  router.post('/delete/:id', customerProgramController.destroy)
})

//contract
app.group("/contract", (router) => {
  router.use(loginController.checkAuthenticated)
  router.get('/', contractController.show)
  router.get('/create',  contractController.create)
  router.get('/edit/:id',uploadFile.upload.array("files"), contractController.edit)
  router.post('/store' ,uploadFile.upload.array("files"),contractController.store)
  router.post('/update/:id/', uploadFile.upload.array("files"), contractController.update)
  router.post('/delete/:id',contractController.destroy)
})

//files image

  router.post('/upload-file/delete',uploadFileController.store)
 
  return app.use('/', router)
}
module.exports = routerInit