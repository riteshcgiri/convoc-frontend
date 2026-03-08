import React from "react";
import { motion } from "framer-motion";
import { useController } from "react-hook-form";

const Switch = ({ name, control, label, defaultValue = false, parentClass = "",}) => {
    const {  field: { value, onChange }, } = useController({ name, control, defaultValue, });

    const handleToggle = () => {
        onChange(!value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
        }
    };

    return (
        <div className={`flex items-center gap-4 cursor-pointer outline-none group rounded-md ${parentClass}`}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="switch"
            aria-checked={value}
        >
            {/* Track */}
            <motion.div className={`w-14 h-7 rounded-full p-1 flex items-center group-focus:ring-2 ring-offset-1 group-focus:ring-primary transition-colors duration-300 ${value ? "bg-primary" : "bg-gray-300" }`} layout>
                {/* Thumb */}
                <motion.div
                    className="w-5 h-5 bg-white rounded-full shadow-md"
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30,}}
                    animate={{ x: value ? 28 : 0,}} />
            </motion.div>

            {label && <span className="text-primary">{label}</span>}
        </div>
    );
};

export default Switch;