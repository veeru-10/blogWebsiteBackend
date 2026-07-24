const express = require('express')
const app = express();
const dotenv = require('dotenv')
const connectDB = require('./db/connectDB.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {handleGetAllUserBlogs, handleGetUserBlog, handlePostBlog, handleUpdateBlog, handleDeleteBlog} = require('./controllers/blogControllers.js')
const { handleGetAllBlogs} = require('./controllers/adminControllers.js')
const adminMiddleWare = require('./middlewares/admin.js')

const authMiddleware = require('./middlewares/auth.js')

const { handleSignUp, handleLogin } = require('./controllers/userController.js')
const upload = require('./middlewares/multer.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: ['https://vercel.app', 'http://localhost:5173'],
  credentials: true // credentials for cookie-based requests
}))

app.use("/uploads", express.static("uploads"));
app.use(cookieParser())

dotenv.config()
connectDB()

app.post("/auth/signup", handleSignUp);
app.post("/auth/login", handleLogin);

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

app.post('/api/logout', authMiddleware, (req, res)=> {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
})
app.get('/api/blogs', authMiddleware, handleGetAllUserBlogs);
app.get('/api/blogs/:id', authMiddleware, handleGetUserBlog);
app.post('/api/blogs', authMiddleware, upload.single('image'), handlePostBlog); //image might be key property 
app.put('/api/blogs/:id', authMiddleware, upload.single('image'), handleUpdateBlog);
app.delete('/api/blogs/:id',authMiddleware, handleDeleteBlog);

app.get('/api/admin', authMiddleware, adminMiddleWare, handleGetAllBlogs)


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
  console.log(`server is running on port ${PORT}`);
})