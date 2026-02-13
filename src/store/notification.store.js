import { create } from "zustand";

let id  = 0;

const MAX_VISIBLE = 3;


const useNotificationStore = create((set) => ({
    notifications : [{id : 1, type : 'info', message : 'Hello this is message', duration : 5000}],
    position : 'bottom-right',

    addNotification : (type, message, duration=5000) => {
        const newNotification = {
            id : id++,
            type,
            message,
            duration
        };

        set((state) => {
            const updated = [...state.notifications, newNotification]

            if(updated.length > MAX_VISIBLE) {
                updated.shift();
            }
            return {notifications : updated};
        })
    },
    
    
    removeNotification : (id) => set((state) => ({notifications : state.notifications.filter((n) => n.id !== id )})),

    setPosition: (pos) => set({ position: pos }),

}))

export default useNotificationStore;