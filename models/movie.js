var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    name: String,
    image: String,
   //  genre: String,
    director: String,
    cast: String,
    description: String,
    year: String,
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }
    ],
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
    }
 });

module.exports = mongoose.model("Movie", movieSchema);