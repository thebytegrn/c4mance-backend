import { Router } from "express";
import authRouter from "./auth.route.js";
import protectedRouter from "./protected.route.js";
import { acceptOrgInviteService } from "../../services/acceptOrgInvite.service.js";
import { getInvitedMember } from "../../services/getInvitedMember.service.js";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/protected", protectedRouter);
v1Router.post("/orgs/member/accept-invite", acceptOrgInviteService);
v1Router.get("/orgs/member", getInvitedMember);

export default v1Router;
