const Blog = require('../models/blogModel')

async function handleGetAllBlogs(req, res) {
  try {
    const blogs = await Blog.find().populate("user", "name email"); //looks into user keyword in blog model
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = {handleGetAllBlogs};