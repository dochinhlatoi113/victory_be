const express = require("express")
const adminController = require("../controller/adminController")
const productController = require("../controller/productController")
const categoryController = require("../controller/categoryController")
let router = express.Router();

const routerInit = (app) => {

    router.get('/', adminController.getIndexPage)
    //product
    router.get('/create-film', productController.createFormFilm)
    router.post('/insert-film',productController.insertFilm)
  
    //category
   
    router.get('/index-category', categoryController.indexCategoryFilm)
    router.get('/create-category', categoryController.createFormCategoryFilm)
    router.post('/insert-category',categoryController.insertFormCategoryFilm)
    // main route
  
    return app.use('/', router)
}
module.exports = routerInit