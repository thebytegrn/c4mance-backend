import express from "express";
import v1Router from "./routes/v1/v1.route.js";
import { connectDB } from "./database/primary.js";
import cookieParser from "cookie-parser";

await connectDB();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", v1Router);

app.get("/ping", (req, res) => {
  res.send("pong!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
