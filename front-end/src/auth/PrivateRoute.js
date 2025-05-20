import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./useUser";

export const PrivateRoute = () => {
  const user = useUser(); // Replace with actual user authentication logic
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
