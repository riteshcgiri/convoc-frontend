import { X } from "lucide-react"
import Button from "../Inputs/Button"
import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "../../store/notification.store"

const positionClasses = {
    "top-right": "top-10 right-0",
    "top-left": "top-10 left-0",
    "bottom-right": "bottom-10 right-0",
    "bottom-left": "bottom-10 left-0",
};


const NotificationManager = () => {




    const { notifications, removeNotification, position } = useNotificationStore()

    return (
        <div className={`fixed pointer-events-none z-[9999] flex flex-col gap-4 ${positionClasses[position]}`}>
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div  key={notif.id} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ duration: 0.3 }} className={`relative min-w-40  p-5 rounded-l-md shadow-lg overflow-hidden
              ${notif.type === "success"  ? "bg-green-200 text-green-600" : notif.type === "error" ? "bg-red-200 text-red-600" : "bg-blue-200 text-blue-600" }`}>
                        <div className="flex justify-end gap-5 items-center">
                            <span className="font-medium">{notif.message}</span>
                            <button onClick={() => removeNotification(notif.id)}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: notif.duration / 1000, ease: "linear" }}
                            onAnimationComplete={() => removeNotification(notif.id)}
                            className={`absolute bottom-0 left-0 h-1 ${notif.type === "success"  ? "bg-green-800 " : notif.type === "error" ? "bg-red-800 " : "bg-blue-800" } `}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

        </div>
    )
}

export default NotificationManager