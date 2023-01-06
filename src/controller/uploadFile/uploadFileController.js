const path = require( "path" );
const fs = require("fs")
let store = async(req, res) =>{
   
}
let  getFilesInDirectory = (fileName) => {
   let deleteFile = path.join(__dirname,"../../public/"+fileName)
   fs.unlinkSync(deleteFile)
  
}
module.exports = {store,getFilesInDirectory}