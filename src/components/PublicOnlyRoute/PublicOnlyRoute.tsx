import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/useAuth';

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }
  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
