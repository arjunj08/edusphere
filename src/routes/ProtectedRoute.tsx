import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/services/auth";

export default function ProtectedRoute({
  role,
  children,
}: {
  role?: Role;
  children: ReactNode;
}) {
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (!profile) return <Navigate to="/auth" replace />;
  if (role && profile.role !== role) {
    return (
      <Navigate to={profile.role === "faculty" ? "/faculty" : "/app/dashboard"} replace />
    );
  }
  return <>{children}</>;
}
