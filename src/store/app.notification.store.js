import { create } from 'zustand'
import api from '../services/api'
import useNotificationStore from './notification.store';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const useAppNotificationStore = create((set, get) => ({
    notifications: [],
    unreadNotification: null,
    totalNotifications: null,
    loading: false,

    fetchNotifications: async () => {
        try {
            set({ loading: true })
            const res = await api.get(`${API_URL}/notification/`)
            set({
                notifications: res.data.notifications,
                totalNotifications: res.data.count
            })
        } catch (error) {
            console.log("FetchNotifcation Err : ", error)
            useNotificationStore().getState().addNotification('error', error.response?.data?.message || 'Failed to fetch notifications')
        } finally {
            set({ loading: false })
        }
    },

    markAsRead: async (id) => {
        try {
            const res = await api.patch(`${API_URL}/notification/${id}/read-notification`)
            set((state) => ({
                notifications: state.notifications.map(n => n._id === res.data.notification._id ? res.data.notification : n)
            }))
        } catch (error) {
            console.log("MarkRead Err : ", error)
            useNotificationStore().getState().addNotification('error', error.response?.data?.message || 'Failed to mark read notifications')
        }

    },

    deleteNotification: async (id) => {

        try {
            const res = await api.patch(`${API_URL}/notification/${id}/delete-notification`);
            set((state) => ({
                notifications: state.notifications.filter(n => n._id !== id)
            }))
        } catch (error) {
            console.log("Delete Notification Err : ", error)
            useNotificationStore().getState().addNotification('error', error.response?.data?.message || 'Failed to delete notification.')
        }

    },

    markAllRead: async () => {

        try {
            const res = await api.patch(`${API_URL}/notification/read-all-notifications`);

            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true }))
            }))

        } catch (error) {
            console.log("MarkAll Notification Err : ", error)
            useNotificationStore().getState().addNotification('error', error.response?.data?.message || 'Failed to mark all notification.')
        }

    },

    clearAll: async () => {
        
        try {
            const res = await api.patch(`${API_URL}/notification/delete-all-notifications `)
            set((state) => ({
                notifications : []
            }))
        } catch (error) {
            console.log("Delte All Notification Err : ", error)
            useNotificationStore().getState().addNotification('error', error.response?.data?.message || 'Failed to delete all notification.')
        }
    }




}))

export default useAppNotificationStore