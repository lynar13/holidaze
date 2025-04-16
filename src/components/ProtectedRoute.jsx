// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireManager }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Still loading the user
  if (user === undefined) {
    return (
      <div className="text-center font-[Poppins] py-20 text-xl">
        Loading user...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role
  if (requireManager !== undefined && user.venueManager !== requireManager) {
    return <Navigate to={user.venueManager ? "/venue-manager" : "/customer"} replace />;
  }

  return children;
};

export default ProtectedRoute;