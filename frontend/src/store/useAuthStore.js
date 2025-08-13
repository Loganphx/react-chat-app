import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp: false,
    isLoggingIn:false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser:res.data})
        } catch (error) {
            set({authUser:null})
            console.log(error)
        } finally {
            set({isCheckingAuth:false})
        }
    },
    signup: async (data) => {
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({authUser: res.data})
        } catch (error) {
            console.log(error);
            toast.error(`Failed to create account: ${error.response.data.message}`);
        } finally {
            set({isSigningUp:false})
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged out successfully");

        } catch(error) {
            toast.error(`Failed to logout: ${error.response.data.message}`);
        }
    },
    login: async (data) => {
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data})
            toast.success("Login successfully");
        } catch(error) {
            toast.error(`Failed to login: ${error.response.data.message}`);
        } finally {
            set({isLoggingIn:false});
        }
    },
    updateProfile: async (data) => {
        set({isUpdatingProfile:true});
        try {
            const {profilePic} = data;
            const formData = new FormData();
            formData.append("avatar", profilePic);
            const res = await axiosInstance.put("/auth/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch(error) {
            toast.error(`Failed to upload profile: ${error.response.data.message}`);
        } finally {
            set({isUpdatingProfile:false});
        }
    }
}));