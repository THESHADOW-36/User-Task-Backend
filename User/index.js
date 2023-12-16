import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
dotenv.config();

app.use("/api/v1", router)

mongoose.connect(process.env.DATABASE_URL).then(() => console.log("Connected to Database..."))

app.listen(8000, () => console.log("Server is running on port 8000."))