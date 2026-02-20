import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";
import useAuthStore from "../store/auth.store";

const useSocket = () => {
  const { user } = useAuthStore();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!user?._id) return;
    if (connectedRef.current) return; // prevent double connect

    connectedRef.current = true;
    connectSocket(user._id);

    // No cleanup here — socket should persist across re-renders
  }, [user?._id]);
};

export default useSocket;