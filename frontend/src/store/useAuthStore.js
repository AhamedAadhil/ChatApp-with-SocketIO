import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user, isCheckingAuth: false });
    } catch (error) {
      console.log("Error in check auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/auth/signup", data);
      if (response.data.success === true) {
        set({ authUser: response.data.user, isSigningUp: false });
        return toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error in signup: ", error);
      return toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  signin: async (data) => {
    try {
      set({ isSigningIn: true });
      const response = await axiosInstance.post("/auth/signin", data);
      if (response.data.success === true) {
        set({ authUser: response.data.user, isSigningIn: false });
        return toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error in signin: ", error);
      return toast.error(error.response.data.message);
    } finally {
      set({ isSigningIn: false });
    }
  },
  signout: async () => {
    try {
      const response = await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      return toast.success(response.data.message);
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const response = await axiosInstance.put("/auth/update-profile", data);
      if (response.data.success === true) {
        set({ authUser: response.data.user });
        return toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error in update profile: ", error);
      return toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
