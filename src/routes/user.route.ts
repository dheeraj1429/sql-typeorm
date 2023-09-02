import express from "express";
import * as userController from "../controllers/user.controller";
const router = express.Router();

// GET
router.get("/get-all-users", userController.getUsers);

export default router;
