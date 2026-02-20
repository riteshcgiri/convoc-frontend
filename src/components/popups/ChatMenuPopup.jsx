import { motion } from "framer-motion";

const ChatMenuPopup = ({ options, className = "" }) => {
  return (
    <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1],}} style={{ originY: 0 }}  className={` bg-white shadow-xl shadow-black/10 min-w-44 absolute ml-5 p-2 grid gap-1 rounded-xl z-[100] border border-zinc-100 overflow-hidden ${className}`}>
      {options.map((option) => (
        <motion.div  key={option.title} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }} className={` cursor-pointer flex gap-2 text-xs p-3 rounded-lg items-center  transition-colors duration-200   ${option?.style ? option.style : "text-primary hover:bg-primary/15"}`} onClick={option?.fnc}>
          {option.icon}
          <h2 className="flex-1">{option.title}</h2>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ChatMenuPopup;
