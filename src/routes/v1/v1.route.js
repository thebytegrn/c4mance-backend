import { Router } from "express";
import authRouter from "./auth.route.js";
import protectedRouter from "./protected.route.js";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/protected", protectedRouter);

export default v1Router;
