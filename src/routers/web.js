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
const initPassportLocal = require('../controller/auth/passport');
const userController = require("../controller/userController")
const userPermissionController = require("../controller/userPermissionController")
const { check, body, validationResult } = require('express-validator');
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
    router.get('/', loginController.checkAuthenticated, recivingController.getIndexPage)
    router.get('/create-reciving-room', recivingController.create)
  })

  router.get('/group', loginController.checkAuthenticated, groupController.show)
  //group/permssion
  router.get('/group/permission', loginController.checkAuthenticated, permissionController.show)
  //group/department
  router.get('/group/department', loginController.checkAuthenticated, departmentController.show)
  // router.get('/group/department/edit/:id',loginController.checkAuthenticated ,departmentController.edit)   
  router.get('/group/department/create', loginController.checkAuthenticated, departmentController.create)
  router.get('/group/department/edit/:id', loginController.checkAuthenticated, departmentController.edit)
  router.post('/group/department/store', checkValidate.schema, basevalidator.checkvalidate.validateDepartment, loginController.checkAuthenticated, departmentController.store)
  router.post('/group/department/update/:id', loginController.checkAuthenticated, checkValidate.schema, basevalidator.checkvalidate.validateDepartment, departmentController.update)
  router.post('/group/department/delete/:id', loginController.checkAuthenticated, departmentController.destroy)
  //user 
  app.group("/group/user", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/', userController.show)
    router.get('/create', userController.create)
    router.post('/delete/:id', userController.destroy)
    router.post('/store', checkValidate.checkRegisterUser, basevalidator.checkvalidate.checkRegisterUser, userController.store)
  })


  //user permission
  app.group("/group/user-permission", (router) => {
    router.use(loginController.checkAuthenticated)
    router.get('/', userPermissionController.show)
    router.get('/create', userPermissionController.create)
    router.post('/delete/:id', userPermissionController.destroy)
    router.post('/store', userPermissionController.store)
    router.post('/update/:id', userPermissionController.update)
  })
  // sidebar 


  return app.use('/', router)
}
module.exports = routerInit