import express from "express";

import { protectRoute } from "../middlewares/protectRoute.middleware.js";

import {
  signIn,
  signUp,
  signOut,
  updateProfile,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

router.put("/update-profile", protectRoute, updateProfile);

export default router;
