import express from "express";
import dotenv  from "dotenv";
dotenv.config();

import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes.js";

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", routes);          // prefix ALL routes with /api

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo failed:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
