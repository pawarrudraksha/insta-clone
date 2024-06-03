import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

// Define a type for the slice state
interface NotificationState {
  isNotificationRequestsModalOpen: boolean;
  isNotificationModalOpen: boolean;
}

const initialState: NotificationState = {
  isNotificationRequestsModalOpen: false,
  isNotificationModalOpen: false,
};

interface createNotificationArgs {
  type: string;
  postId?: string;
  comment?: string;
  receiverId: string;
}
export const createNotification = createAsyncThunk(
  "notification/create",
  async ({ type, comment, postId, receiverId }: createNotificationArgs) => {
    try {
      const response = await axios.post(`/notifications/create`, {
        type,
        comment,
        postId,
        receiverId,
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (postId: string) => {
    try {
      const response = await axios.delete(
        `/notifications/delete-by-postId/${postId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getAllNotifications = createAsyncThunk(
  "notification/get-all",
  async (page?: number) => {
    try {
      page = page || 1;
      const response = await axios.get(`/notifications/get-all?page=${page}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    toggleNotificationModal: (state) => {
      state.isNotificationModalOpen = !state.isNotificationModalOpen;
    },
    toggleNotificationRequestsModal: (state) => {
      state.isNotificationRequestsModalOpen =
        !state.isNotificationRequestsModalOpen;
    },
  },
});
export const selectIsNotificationModalOpen = (state: RootState): boolean =>
  state.notification.isNotificationModalOpen;
export const selectIsNotificationRequestsModalOpen = (
  state: RootState
): boolean => state.notification.isNotificationRequestsModalOpen;
export const { toggleNotificationModal, toggleNotificationRequestsModal } =
  notificationSlice.actions;

export default notificationSlice.reducer;
