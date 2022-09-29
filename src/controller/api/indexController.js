const db =  require("../../config/db/connect")
const dataFilm  = require("../../models/film")
const bodyParser = require("body-parser");
const { ConnectionStates } = require("mongoose");
const multer = require("multer")
const path = require("path")

const upload = require("../../helper/uploadFile");

// const multerHelper =  require("../../helper/uploadFile")
function notification(id){
    res.status(404).send({
        message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
    });
}
//get data
let getDataPage =  (req, res) => {
   
    dataFilm.find((err, dataFilm) => {
        if (!err) {
            return res.json({
                dataFilm:dataFilm
            })
        }
        else {
            console.log('Error in retrieving users list :' + err);
        }
    }).lean();    
}
//updataDataIndex
let updataDataIndex =  (req, res) => {
  
    let id = req.params.id;
    let updatedData = {
        name : req.body.name,
        url:req.body.url ?  req.body.url : null,
        price: req.body.price,
        slug: req.body.name
    }
    dataFilm.findByIdAndUpdate(id, updatedData).then(data => {
    
        if (!data) {
            notification(id)
        } 
        else res.send({ message: "Tutorial was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });
}
//delete 

let deleteDataIndex =  (req, res) => {
  
    let id = req.params.id;
    
    dataFilm.findByIdAndDelete(id).then(data => {
        notification(id)
      });
}
// create
let total;
let getPath = (req,res) => {
    let pathImg =  path.join(__dirname, '../../public/imageUploadApi/' + req.file.filename);
        total = pathImg
 
}

let insertData = (req,res) => {
    console.log(total)

   const dataFilms = new dataFilm({
    name: req.body.name,
    url:  req.body.url,
    price:  req.body.price,
    // slug: { type: String },
    category :  req.body.category,
    description :  req.body.description,
   })
  
}

module.exports = {
    getDataPage,updataDataIndex,deleteDataIndex,insertData,getPath
}