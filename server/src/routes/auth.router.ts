import express from "express";
import { authUrl } from "../models/auth.model.js";

const authRouter = express.Router();
authRouter.get("/", authUrl);

export { authRouter };
