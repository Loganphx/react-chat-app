import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId) => {
       set({isMessagesLoading: true});
       try {
           const res = await axiosInstance.get(`/messages/${userId}`);
           set({messages:res.data});
       } catch (error) {
           toast.error(error.response.data.message);
       } finally {
           set({isMessagesLoading: false});
       }
    },
    sendMessage : async (messageData) => {
        const {selectedUser, messages} = get();
        const {text, image} = messageData;
        const formData = new FormData();
        formData.append("text", text);
        formData.append("image", image);
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            set({messages:[...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", async (message) => {
            const isMessageSentFromSelectedUser = message.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;
            set({messages:[...get().messages, message],
            });
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => {
        set({selectedUser});
    }
}));