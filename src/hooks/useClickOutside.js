import { useEffect } from "react";

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("pointerdown", handleClickOutside);


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
