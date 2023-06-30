import express from "express";
import connectDB from "./db";
const app = express();
app.use(express.json());

connectDB();
app.listen(5000, () => {
  console.log("Listening at port 5000");
});

import mongoose from "mongoose";
