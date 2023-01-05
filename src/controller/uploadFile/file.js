let multer = require("multer");
const { nextTick } = require("process");
let path = require("path");
const { Model } = require("sequelize");
const { Module } = require("module");

// const upload = multer({ dest:'../public/image/fileCustomer' })
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let pathImg =  path.join(__dirname, '../../public/image/fileCustomer');
    //files khi upload xong sẽ nằm trong thư mục "uploads" này - các bạn có thể tự định nghĩa thư mục này
    cb(null, pathImg) 
  },
  filename: function (req, file, cb) {
    // tạo tên file = thời gian hiện tại nối với số ngẫu nhiên => tên file chắc chắn không bị trùng

    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    cb(null, filename + '-' + file.originalname )
  }
})
//Khởi tạo middleware với cấu hình trên, lưu trên local của server khi dùng multer
const upload = multer({ storage: storage })

module.exports = {upload}