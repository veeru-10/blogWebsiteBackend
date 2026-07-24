const Blog = require('../models/blogModel.js');

async function handleGetAllUserBlogs(req, res) {
  try {
    const blogData = await Blog.find({ user: req.user._id })
    res.status(200).json(blogData)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function handleGetUserBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
    if(!blog) {
      return res.status(404).send({message: "blog is not found"})
    }
    res.status(200).json({
      success : true,
      blog : blog
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function handlePostBlog(req, res) {
  try {
    const { title, description, category} = req.body;
    // Cloudinary stores full URL in req.file.path
    const image = req.file ? req.file.path : req.body.image;
    const addBlog = await Blog.create({ title, description, category, image, user : req.user._id});
    res.status(201).json({
      success : true,
      message : "added the blog",
      blog: addBlog
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function handleUpdateBlog(req, res) {
  try {
    const updateData = { ...req.body }; // taking body from clent 
    if (req.file) { // seperate checking for files
      // Cloudinary stores full URL in req.file.path
      updateData.image = req.file.path;
    }
    const updateBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' }) //
    if(!updateBlog) {
      return res.status(404).send({message: "blog is not found"})
    }
    res.json({
      success : true,
      message : "update the blog",
      blog: updateBlog
    })
  }catch(error){
    res.status(500).send(error.message)
  }
}

async function handleDeleteBlog(req, res) {
  try {
    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
    if(!deleteBlog) {
      return res.status(404).send({message: "Blog is not found"})
    }
    res.status(200).json({
      message: "delete Successfully",
      blog : deleteBlog
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}


module.exports = {handleGetAllUserBlogs, handleGetUserBlog, handlePostBlog, handleUpdateBlog, handleDeleteBlog}