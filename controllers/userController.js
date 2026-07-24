const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function handleSignUp(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    // const normalizedRole = role === "admin" ? "admin" : "user";
    const hashedPwd = await bcrypt.hash(password, 10);
    const signUpUser = await User.create({
      name,
      email,
      password: hashedPwd,
      role,
    });

    if (!signUpUser) {
      return res.status(404).json({ success: false, message: "User could not be created" });
    }

    res.status(201).json({
      success: true,
      message: "User signed up successfully",
      role: signUpUser.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body; // we have to find based on user credencials.
    const user = await User.findOne({email});
    //check user
    if(!user) {
      return res.status(400).json({message : "user is not found"});
    }

    //check password
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) return res.status(400).json({message : "Invalid credencials"});

    const secretKey = process.env.SECRET_KEY || "veeranjini10@";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1d' }) // required unique for finding particular user
    
    // Determine if we're in production (Render uses HTTPS)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
    
    res.cookie("token", token, {
      httpOnly : true,
      secure : isProduction ? true : false, // Use true for HTTPS (Render/Vercel), false for localhost
      sameSite : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.json({message : "login successful"})
  } catch(error) {
    res.status(500).send(error.message)
  }
}

module.exports = { handleSignUp, handleLogin }