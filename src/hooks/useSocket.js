import { useEffect, useRef } from "react";
import { connectSocket } from "../services/socket";
import useAuthStore from "../store/auth.store";

const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!user?._id || connectedRef.current) return;
    connectedRef.current = true;
    connectSocket(user._id);
  }, [user?._id]);
};

export default useSocket;