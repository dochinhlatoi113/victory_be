const path = require( "path" );
const fs = require("fs")
const db = require("../../models/index");
let store = async(req, res) =>{
   
}
let  getFilesInDirectory = (fileName) => {
   let deleteFile = path.join(__dirname,"../../public/"+fileName)
    fs.unlinkSync(deleteFile)

}

let deleteMedias = async (req, res) => {
 
   let id = req.body.key
  
   try {

      let lists = await db.medias.findOne(
           { where: { id: id, model:"contracts"} }
       )
      await lists.destroy()
      getFilesInDirectory(lists.mediaFiles),
       req.flash('message', 'delete successfully');
       res.redirect("/contract/edit/" + modelId)
   } catch (err) {
       res.send(err);
   }
}
module.exports = {
   store,getFilesInDirectory,deleteMedias
}