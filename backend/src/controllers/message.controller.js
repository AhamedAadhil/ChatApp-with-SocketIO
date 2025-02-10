import cloudinary from "../libs/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    return res.status(200).json({ filteredUsers, success: true });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    return res.status(200).json({ messages, success: true });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imgUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imgUrl,
    });
    await newMessage.save();
    // todo: real time functionality will be implement with socket.io
    return res.status(200).json({ newMessage, success: true });
  } catch (error) {
    console.error(error.message);
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
