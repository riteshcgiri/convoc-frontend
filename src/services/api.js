import axios from "axios";
import useAuthStore from "../store/auth.store";
import useNotificationStore from "../store/notification.store";


const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore.getState();

            authStore.logout();

            useNotificationStore.getState().addNotification("error","Session expired. Please login again.");

            window.location.href = "/signin";
        }

        return Promise.reject(error);
    }
);

export default api;