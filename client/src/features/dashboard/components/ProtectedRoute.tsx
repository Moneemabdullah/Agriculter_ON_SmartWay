import React from "react";
import { Navigate, useParams } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const loggedUserId = localStorage.getItem("userId");
  const { userId } = useParams<{ userId: string }>();

  if (!token) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (userId && userId !== loggedUserId) {
    // Trying to access other user's dashboard
    return <Navigate to={`/dashboard/${loggedUserId}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
