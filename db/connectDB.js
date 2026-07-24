const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongoDB connected Successfully")
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = connectDB;