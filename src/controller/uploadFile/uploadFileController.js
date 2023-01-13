const path = require( "path" );
const fs = require("fs")
let store = async(req, res) =>{
   
}
let  getFilesInDirectory = (fileName) => {
   let deleteFile = path.join(__dirname,"../../public/"+fileName)
   fs.unlinkSync(deleteFile)
  
}

let deleteMedias = async (req, res) => {
   console.log(req.body)
   return false
   let id = req.params.idDelete
   try {
       await db.medias.destroy(
           { where: { id: id, model: "contracts" } }
       )
       const count = await db.medias.count({
           where: {
               modelId: modelId,
               model: "customers"
           }
       });
       // req.flash('message', 'delete successfully');
       // res.redirect("/contract/edit/" + modelId)
   } catch (err) {
       res.send(err);
   }
}
module.exports = {
   store,getFilesInDirectory,deleteMedias
}