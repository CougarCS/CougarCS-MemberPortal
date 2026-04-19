import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

export const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Navigate to="/profile" replace />;

  return <>{children}</>;
};
