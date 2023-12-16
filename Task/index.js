import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
dotenv.config();

app.use("/api/v1", router)

app.listen(8001, () => console.log("Server is running on port 8001."))