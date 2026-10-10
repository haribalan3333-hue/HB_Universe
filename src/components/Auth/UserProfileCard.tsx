import React from 'react';
import { useAuth } from '../../auth/AuthManager';
import { useUniverseStore } from '../../store/universeStore';
import { getRankForLevel } from '../../progression/RankManager';

export const UserProfileCard: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { character } = useUniverseStore();
  const rank = getRankForLevel(character.level);

  if (!isAuthenticated || !user) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👤</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>GUEST PILOT</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>
          Progress is saved in local browser storage. Create an HB ID for cloud synchronization across devices.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          style={{
            padding: '10px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f0ff, #0077ff)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0,240,255,0.4)'
          }}
        >
          AUTHENTICATE / REGISTER
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(11, 15, 25, 0.95))',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 240, 255, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,240,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          boxShadow: '0 0 20px rgba(0,240,255,0.4)',
          border: '2px solid rgba(255,255,255,0.8)'
        }}>
          {user.avatar || '🚀'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
              {user.display_name}
            </h3>
            <span style={{
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#00f0ff'
            }}>
              VERIFIED ID
            </span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
            @{user.username}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        padding: '12px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Level</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f0ff' }}>{character.level}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rank</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffd700' }}>{rank.tier}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coins</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffb703' }}>🪙 {character.coins.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Total XP: {character.xp.toLocaleString()}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = '#ef4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};
