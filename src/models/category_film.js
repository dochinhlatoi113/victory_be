const mongoose = require("mongoose")
var slug = require('mongoose-slug-generator')
mongoose.plugin(slug);
  Schema = mongoose.Schema;

const categorySchema= new Schema({
  name: { type: String }, 
  slug: { type: String, slug: "name" }
});
const category_film = mongoose.model("category_film",categorySchema) 
//model , schema    , colection trong db
module.exports = category_film
