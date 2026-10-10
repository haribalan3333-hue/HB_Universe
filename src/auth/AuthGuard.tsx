import React, { ReactNode } from 'react';
import { useAuth } from './AuthManager';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        color: '#fff'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '16px',
          textShadow: '0 0 20px rgba(0,240,255,0.6)'
        }}>🔒</div>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          letterSpacing: '2px',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          HB ID REQUIRED
        </h2>
        <p style={{
          color: '#94a3b8',
          maxWidth: '450px',
          marginBottom: '24px',
          lineHeight: '1.6'
        }}>
          This zone is reserved for authenticated pilots of HB UNIVERSE. Authenticate or create your universal ID to save cloud progress.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff, #0077ff)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: '1px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0,240,255,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          AUTHENTICATE HB ID
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
