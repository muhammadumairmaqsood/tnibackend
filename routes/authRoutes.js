import express from "express";

import { loginAdmin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", loginAdmin);

export default authRouter;
