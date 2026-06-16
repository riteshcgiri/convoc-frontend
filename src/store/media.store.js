import { create } from 'zustand';
import api from '../services/api'
import useNotificationStore from './notification.store'


const useMediaStore = create((set) => ({
    files: [],
    docs: [],
    links: [],
    loading: false,

    fetchMedia: async (chatId) => {
        set({ loading: true, files: [], docs: [], links: [] });
        try {
            const [filesRes, docsRes, linksRes] = await Promise.all([
                api.get(`message/media/files`),
                api.get(`message/media/docs`),
                api.get(`message/media/links`),
            ])
            set({
                files: Array.isArray(filesRes.data) ? filesRes.data : filesRes.data?.messages || [],
                docs: Array.isArray(docsRes.data) ? docsRes.data : docsRes.data?.messages || [],
                links: Array.isArray(linksRes.data) ? linksRes.data : linksRes.data?.messages || [],
            })

        } catch (error) {
            // useNotificationStore.getState().addNotificationStore({ type: 'error', message: error?.response?.message || 'Failed to get Media' })
            console.log(error)
        } finally {
            set({ loading: false })
        }
    },

}))


export default useMediaStore