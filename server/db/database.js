require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.DB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.log("error while connecting mongodb", error.message);
  }
}

module.exports = connectDB;