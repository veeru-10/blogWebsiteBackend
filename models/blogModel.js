const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  image : String,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'user'
  },
  category : String,
},{
  timestamps : true
})

const Blog = mongoose.model("blog", blogSchema)

module.exports = Blog;