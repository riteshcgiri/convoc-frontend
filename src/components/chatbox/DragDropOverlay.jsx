import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

const DragDropOverlay = ({ isDragging }) => {
    return (
        <AnimatePresence>
            {isDragging && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm border-4 border-dashed border-primary rounded-xl pointer-events-none">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-3">
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                        </motion.div>
                        <p className="text-primary font-bold text-lg">Drop it Here</p>
                        <p className="text-primary/60 text-sm">Drop your file here to send</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DragDropOverlay;