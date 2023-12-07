import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function PrivateRoutes() {
  const isAuthenticated = useAuth();
  const userRole = localStorage.getItem("role");

  if (isAuthenticated && (userRole === "Admin" || userRole === "Cashier")) {
    return <Outlet />;
  } else if (
    isAuthenticated &&
    userRole !== "Admin" &&
    userRole !== "Cashier"
  ) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoutes;