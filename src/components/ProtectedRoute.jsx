// components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requireManager }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireManager && !user.venueManager) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
