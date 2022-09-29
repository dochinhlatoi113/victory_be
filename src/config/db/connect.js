const mongoose = require("mongoose");

async function connectDb() {
  try {
    var mongoDB = "mongodb://127.0.0.1:27017/db_film";
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log(mongoose.connection.readyState);
    console.log("ok connect db thành công");
  } catch (error) {
    console.log("fail");
  }
}

module.exports = { connectDb };
