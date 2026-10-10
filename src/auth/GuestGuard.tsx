import React, { ReactNode } from 'react';
import { useAuth } from './AuthManager';

interface GuestGuardProps {
  children: ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null; // Guest only
  }

  return <>{children}</>;
};
