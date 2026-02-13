import { create } from "zustand";
import api from "../services/api";
import useNotificationStore from "./notification.store";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;



const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isAuth: !!localStorage.getItem("token"),
    loading: false,
    error: null,
    otpEmail: null,
    resetSessionActive: false,



    signup: async (data, navigate) => {
        try {
            set({ loading: true, error: null });

            const res = await api.post(`${API_URL}/signup`, data);

            set({
                loading: false,
                otpEmail: res.data.email,
            });

            useNotificationStore.getState().addNotification("success", res.data.message || "Signup successful! Check your email.");

            navigate("/verify-otp?type=signup");;

        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || "Signup failed" });

            const message = err.response?.data?.message || "Signup failed";

            useNotificationStore.getState().addNotification("error", message);
        }
    },

    signin: async (data, navigate) => {
        try {
            set({ loading: true, error: null });

            const res = await api.post(`${API_URL}/signin`, data);

            localStorage.setItem("token", res.data.token);

            set({
                user: res.data,
                token: res.data.token,
                isAuth: true,
                loading: false,
            });

            useNotificationStore.getState().addNotification("success", `Logged In successfully `);
            navigate("/chat");

        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || "Sign In Failed!!", });
            useNotificationStore.getState().addNotification("error", err.response?.data?.message || `Logged In Failed `);
        }
    },

    verifyOtp: async (otp, navigate) => {
        try {
            set({ loading: true, error: null });

            const { otpEmail } = get();

            if (!otpEmail) {
                const message = "Session expired. Please sign up again.";
                set({ loading: false, error: message });
                useNotificationStore.getState().addNotification("error", message);
                return;
            }


            const res = await api.post(`${API_URL}/verify-otp`, {
                email: otpEmail, otp,
            });

            set({ loading: false, otpEmail: null, });
            useNotificationStore.getState().addNotification("success", `Account Verified Successfully`);

            navigate("/signin");

        } catch (err) {
            set({ loading: false, error: err.response?.data?.message || "OTP Verification Failed", });
            useNotificationStore.getState().addNotification("error", err.response?.data?.message || "OTP Verification Failed");
        }
    },

    resendOtp: async (type = "signup") => {
        try {
            set({ loading: true, error: null });

            const { otpEmail } = get();

            const endpoint =
                type === "reset"
                    ? "/resend-reset-otp"
                    : "/resend-otp";

            await api.post(`${API_URL}${endpoint}`, {
                email: otpEmail,
            });

            set({ loading: false });

            useNotificationStore.getState().addNotification(
                "success",
                "OTP resent successfully"
            );

        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to resend OTP";

            set({ loading: false, error: message });

            useNotificationStore.getState().addNotification("error", message);
        }
    },

    requestPasswordReset: async (email, navigate) => {
        try {
            set({ loading: true, error: null });
            await api.post(`${API_URL}/request-reset`, { email });
            set({ loading: false, otpEmail: email, });
            useNotificationStore.getState().addNotification("success", "Password reset OTP sent to your email");
            navigate("/verify-otp?type=reset");

        } catch (err) {
            const message = err.response?.data?.message || "Reset request failed";
            set({ loading: false, error: message });
            useNotificationStore.getState().addNotification("error", message);
        }
    },


    verifyResetOtp: async (otp, navigate) => {
        try {
            set({ loading: true, error: null });
            const { otpEmail } = get();
            await api.post(`${API_URL}/verify-reset-otp`, { email: otpEmail, otp, });
            set({ loading: false, resetSessionActive: true, });
            useNotificationStore.getState().addNotification("success", "OTP verified successfully");
            navigate("/reset-password");

        } catch (err) {
            const message = err.response?.data?.message || "OTP Verification Failed";
            set({ loading: false, error: message });
            useNotificationStore.getState().addNotification("error", message);
        }
    },

    resetPassword: async (password, navigate) => {
        try {
            set({ loading: true, error: null });
            const { otpEmail } = get();
            const res = await api.post(`${API_URL}/reset-password`, { email: otpEmail, password, });
            localStorage.setItem("token", res.data.token);
            set({ user: res.data, token: res.data.token, isAuth: true, loading: false, otpEmail: null, });
            set({ user: res.data, token: res.data.token, isAuth: true, loading: false, otpEmail: null, resetSessionActive: false,});
            useNotificationStore.getState().addNotification("success", "Password changed successfully");
            navigate("/chat");

        } catch (err) {
            const message = err.response?.data?.message || "Password reset failed";
            set({ loading: false, error: message });
            useNotificationStore.getState().addNotification("error", message);
        }
    },








    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuth: false, });
        useNotificationStore.getState().addNotification("success", `Logged Out `);
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
