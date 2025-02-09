import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Found", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token", success: false });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User Not Found", success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
