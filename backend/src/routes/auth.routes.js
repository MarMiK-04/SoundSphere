import { Router } from "express";
import { login, signup, fetchUser } from "../controller/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me",authMiddleware, fetchUser);

export default router;
