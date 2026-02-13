import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/auth.store";

const OtpGuard = ({ children }) => {
  const { otpEmail } = useAuthStore();

  if (!otpEmail) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default OtpGuard;
