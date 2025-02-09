import express from "express";

import { signIn, signUp, signOut } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

export default router;
