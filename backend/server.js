import express from "express";
import dotenv from "dotenv";
import db from "./db/connectMongoDb.js";
import authRoute from "./routes/auth.route.js";


dotenv.config();
const app = express();

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    db();
});
