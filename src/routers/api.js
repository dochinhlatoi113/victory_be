const express = require("express")
// const indexController = require("../controller/api/indexController")
let router = express.Router();
var multer = require("multer")
var path = require("path")
var upload =  require("../helper/uploadFile")
const apiRouterInit = (app) => {   //multer
    
  
    // //
    // router.get('/index', indexController.getDataPage)
    // router.patch('/update/:id',indexController.updataDataIndex)
    // router.delete('/delete/:id',indexController.deleteDataIndex)
    // router.post('/create',indexController.insertData)
    // router.post("/upload-file", upload.single('file'), indexController.getPath)
    // // router.post('/upload-file',upload.single("file"),indexController.uploadDataFile)
    // // router.post("/upload-file", upload.single('file'), (req, res) => {
    // //     res.json({ file: req.file });          
    // //   });
    // //
    return app.use('/api/v1', router)
}
module.exports = apiRouterInit