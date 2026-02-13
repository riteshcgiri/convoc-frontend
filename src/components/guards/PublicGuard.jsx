import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/auth.store";

const PublicGuard = ({ children }) => {
  const { isAuth } = useAuthStore();

  if (isAuth) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export default PublicGuard;
