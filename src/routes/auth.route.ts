import express from "express";
import * as authController from "../controllers/auth.controller";
const router = express.Router();

// POST
router.post("/sign-in", authController.signIn);
router.post("/login", authController.login);

export default router;
