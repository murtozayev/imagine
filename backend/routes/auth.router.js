import e from "express";
import check, { signIn, signOut, signUp } from "../controller/auth.controller.js";
const authRouter = e.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.get("/sign-out", signOut);
authRouter.get("/check", check);

export default authRouter;
