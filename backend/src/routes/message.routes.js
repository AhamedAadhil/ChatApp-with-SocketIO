import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import {
  getUsersForSideBar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.get("/:id", protectRoute, getMessages);
router.post("send/:id", protectRoute, sendMessage);
export default router;
