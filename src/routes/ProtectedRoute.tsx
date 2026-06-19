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
    const home =
      profile.role === "faculty"
        ? "/faculty"
        : profile.role === "guardian"
          ? "/parent"
          : "/app/dashboard";
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}
