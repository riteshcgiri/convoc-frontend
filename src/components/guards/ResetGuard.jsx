import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/auth.store";

const ResetGuard = ({ children }) => {
  const { resetSessionActive } = useAuthStore();

  if (!resetSessionActive) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ResetGuard;
