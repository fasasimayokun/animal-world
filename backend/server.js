import path from "path";
import express from "express";
import dotenv from "dotenv";
import db from "./db/connectMongoDb.js";
import authRoute from "./routes/auth.route.js";
import animalRoute from "./routes/animal.route.js";
import commentAndReplyRoute from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded( {extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/animals", animalRoute);
app.use("/api/comments", commentAndReplyRoute);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.resolve(__dirname,  "frontend", "dist", "index.html"));
    });
}

db().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
