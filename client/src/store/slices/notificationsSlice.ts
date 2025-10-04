import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { ToastOptions } from 'react-hot-toast';

export type NotificationTone = 'default' | 'success' | 'error' | 'warning';

export interface NotificationPayload {
  id?: string;
  message: string;
  tone?: NotificationTone;
  options?: ToastOptions;
}

export interface Notification extends NotificationPayload {
  id: string;
  tone: NotificationTone;
}

interface NotificationsState {
  queue: Notification[];
}

const initialState: NotificationsState = {
  queue: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    enqueueNotification: (state, action: PayloadAction<NotificationPayload>) => {
      const { id = nanoid(), tone = 'default', message, options } = action.payload;
      state.queue.push({ id, tone, message, options });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((notification) => notification.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.queue = [];
    },
  },
});

export const { enqueueNotification, removeNotification, clearNotifications } = notificationsSlice.actions;

export const notificationsReducer = notificationsSlice.reducer;
export const selectNotificationsQueue = (state: { notifications: NotificationsState }) => state.notifications.queue;

export default notificationsReducer;
