import { create } from 'zustand'
import api from '../services/api'
import useNotificationStore from './notification.store'

const useCallLogStore = create((set) => ({
    callLogs: [],
    fetchLoading: false,
    deleteLoading: false,


    fetchCallLogs: async () => {
        set({ fetchLoading: true })
        try {
            const res = await api.get('/call-logs');
            set({ callLogs: res.data })


        } catch (error) {
            console.log('Fetch Call Logs Err : ', error)
            useNotificationStore.getState().addNotification('error', error?.response?.message || '')

        } finally {
            set({ fetchLoading: false })
        }
    },

    deleteCallLog: async (logId) => {
        set({ deleteLoading: true })
        try {
            const res = await api.delete(`/call-logs/${logId}`);
            set((state) => ({ callLogs: state.callLogs.filter(log => log._id !== logId) }))
        } catch (error) {
            console.log('Delete Call Log Err : ', error)
            useNotificationStore.getState().addNotification('error', 'Failed to delete call log')
        } finally {
            set({ deleteLoading: false })
        }
    },

    addCallLog: (log) => set((state) => ({ callLogs: [log, ...state.callLogs] })),


    clearCallLogs: () => set({ callLogs: [] }),

}))



export default useCallLogStore
