import express from "express";
import { signIn, signOut } from "../controllers/authController";
import { createUser } from "../controllers/userController";

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", signIn);
router.get("/signout", signOut);

export default router;
