import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import "./config/redis.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import googleAuthRoutes from "./routes/GoogleAuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messageRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
console.log("PORT:", port);
console.log("ORIGIN:", process.env.ORIGIN);
console.log("DATABASE_URL:", databaseURL);

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.enable("trust proxy");
app.use(passport.initialize());

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = app.listen(port, async () => {
  console.log(`server is running at ${port}`);
  await mongoose
    .connect(databaseURL)
    .then(() => console.log("DB connection successful"))
    .catch((err) => err.message);
  setupSocket(server);
});
