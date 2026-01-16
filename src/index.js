import express from "express";
import v1Router from "./routes/v1/v1.route.js";
import { connectDB } from "./database/primary.database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { connectRedis } from "./database/redis.database.js";
import { ZodError } from "zod";
import cors from "cors";

export const redisClient = await connectRedis();

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "c4mance:",
});

await connectDB();
const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: [
      "https://c4mance.com",
      "https://www.c4mance.com",
      "localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.use("/v1", v1Router);

app.get("/ping", (req, res) => {
  res.send("pong!");
});

app.use((err, req, res, next) => {
  if (typeof err === "object") {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Bad input, could not process data",
        issues: err.issues,
      });
    }

    if (
      err.name === "MongoServerError" &&
      "code" in err &&
      err.code === 11000
    ) {
      return res.status(422).json({
        success: false,
        message: "Duplicate record not allowed",
      });
    }
  }
  console.log("Internal server error:\n", err);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
