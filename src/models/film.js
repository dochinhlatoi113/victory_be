const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const film = new Schema({
  name: { type: String },
  url: { type: String },
  price: { type: Number },
  slug: { type: String },
  category : { type: Number },
  description : { type: String },
});
//model , schema    , colection trong db
module.exports = mongoose.model("film", film, "film");
