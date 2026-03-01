import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Select = ({ name, label, options = [], parentClass = "", labelClass = "", inputClass = "", error, register, setValue, watch,}) => {
  const selectedValue = watch(name);

  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (value) => {
    setValue(name, value, { shouldValidate: true });
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      setOpen(true);
      setHighlightIndex(0);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1
      );
    }

    if (e.key === "Enter" && open && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(options[highlightIndex].value);
    }

    if (e.key === "Escape") {
      setOpen(false);
    }

    if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${parentClass}`} ref={dropdownRef}>
      {/* Label */}
      <label className={`absolute -top-2 left-4 bg-white px-2 rounded-md text-sm font-semibold text-primary ${labelClass}`} >
        {label}
      </label>

      {/* Select Box */}
      <div
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 py-4 border-2 rounded-xl cursor-pointer flex justify-between items-center outline-none transition
        ${error ? "border-red-500" : "border-primary focus:bg-primary/20 "} ${inputClass}`} >
        <span className="text-primary font-semibold">
          {selectedValue ? options.find((o) => o.value === selectedValue)?.label : "Select option"}
        </span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      <input type="hidden" {...register(name)} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute z-50 w-full mt-2 bg-white border border-primary rounded-xl shadow-lg overflow-hidden"
          >
            {options.map((option, index) => (
              <div key={option.value} onClick={() => handleSelect(option.value)} className={`px-4 py-3 cursor-pointer transition font-medium
                  ${highlightIndex === index ? "bg-primary/20" : "hover:bg-primary/10"}
                  ${selectedValue === option.value ? "text-primary font-bold" : "text-primary"}`}>
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (<p className="text-red-500 text-sm mt-1"> {error.message} </p>)}
    </div>
  );
};

export default Select;