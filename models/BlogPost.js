const mongoose=require("mongoose");// additional line to import the mongoose
const Schema = mongoose.Schema;
const BlogPostSchema = new Schema({
  title: String,
  body: String
  });


const BlogPost = mongoose.model('BlogPost',BlogPostSchema);// make this module importable in other modules  
module.exports = BlogPost




    