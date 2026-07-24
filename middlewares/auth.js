const jwt = require("jsonwebtoken");

let User = require("../models/userModel.js");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // console.log(token);

    const secretKey = process.env.SECRET_KEY || "veeranjini10@";
    const decodedData = jwt.verify(token, secretKey);

    // console.log(decodedData); // having id and role

    let loggedInUser = await User.findById(decodedData.id);

    if (!loggedInUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    req.user = loggedInUser;
    next();
    
  } catch (err) {
    return res.json({
      success: false,
      message: "Inavid Token or Expired Token",
    });
  }
};

module.exports = authMiddleware;
