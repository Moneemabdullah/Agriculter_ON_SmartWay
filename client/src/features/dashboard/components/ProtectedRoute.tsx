import React from "react";
import { Navigate, useParams } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const loggedUserId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const { userId } = useParams<{ userId: string }>();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (userId && userId !== loggedUserId) {
    return <Navigate to={`/dashboard/${loggedUserId}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
