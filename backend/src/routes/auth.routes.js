import express from "express";

import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import {
  signIn,
  signUp,
  signOut,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
