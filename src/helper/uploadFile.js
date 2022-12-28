const multer = require('multer');
var path = require("path")
let pathImg =  path.join(__dirname, '../public/imageUploadApi');
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {      
        cb(null, pathImg) 
      },
      filename: function (req, file, cb) {       
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
        cb(null, filename + '-' + file.originalname )
      }
    })
    const upload = multer({ storage: storage }) 
module.exports = upload;
