import express from "express";
import v1Router from "./routes/v1/v1.route.js";
import { connectDB } from "./database/primary.database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import redisClient from "./database/redis.database.js";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "c4mance:",
});

await connectDB();
const app = express();

app.set("trust proxy", true);

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
