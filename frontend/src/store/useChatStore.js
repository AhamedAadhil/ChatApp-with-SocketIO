import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChartStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const response = await axiosInstance.get("/messages/users");
      if (response.data.success === true) {
        set({ users: response.data.filteredUsers, isUsersLoading: false });
      }
    } catch (error) {
      console.log("Error in getUsers: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    try {
      set({ isMessagesLoading: true });
      const response = await axiosInstance.get(`/messages/${userId}`);
      if (response.data.success === true) {
        set({ messages: response.data.messages, isMessagesLoading: false });
      }
    } catch (error) {
      console.log("error in getMessages: ", error);
      return toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    try {
      const { selectedUser, messages } = get();
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        data
      );
      if (response.data.success === true) {
        set({ messages: [...messages, response.data.newMessage] });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      return;
    }
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },
}));
