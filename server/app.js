import express from "express";
import mongoose from "mongoose";
import config from "./config";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import morgan from "morgan";

const app = express();
const {MONGO_URI} = config;

// express configuration
app.use(hpp());
// 보안 - Express middleware to protect against HTTP Parameter Pollution attacks
app.use(helmet());
// 보안 - secure your Express apps by setting various HTTP headers.
app.use(cors({origin: true, credential: true}));
// CORS - a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(morgan("dev"));
// Log - HTTP request logger middleware for node.js
app.use(express.json());
// 브라우저에서 내용을 보내면 서버에서 json 형태로 해석한다.

mongoose.connect(MONGO_URI)
	.then(() => console.log("MongoDB connecting Success!!"))
	.catch((e) => console.log({e}));

// Use routes
app.get("/");
// '/'는 home이라는 뜻이다.

export default app;
