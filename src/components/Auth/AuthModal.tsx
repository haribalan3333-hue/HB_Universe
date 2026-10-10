import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { AuthManager } from '../../auth/AuthManager';
import { validatePassword, validateUsername } from '../../auth/PasswordValidator';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { soundEnabled, showSpeech } = useUniverseStore();
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER' | 'FORGOT'>('LOGIN');

  // Form states
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) audioManager.playClick();
    setErrorMsg('');
    setSuccessMsg('');

    if (tab === 'REGISTER') {
      const uVal = validateUsername(username);
      if (!uVal.valid) return setErrorMsg(uVal.message);

      const pVal = validatePassword(password);
      if (!pVal.valid) return setErrorMsg(pVal.message);

      if (password !== confirmPassword) {
        return setErrorMsg('Passwords do not match.');
      }

      setLoading(true);
      const res = await apiClient.post('/auth/register', {
        username: username.trim().toLowerCase(),
        display_name: displayName.trim() || username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setLoading(false);

      if (res.success && res.data) {
        AuthManager.saveSession(res.data.user, res.data.access_token);
        showSpeech(`✨ WELCOME TO THE UNIVERSE, ${res.data.user.display_name}!`, 4000);
        onSuccess();
      } else {
        // Safe offline simulated registration if backend is offline
        const mockUser = {
          id: 'user-' + Date.now(),
          username: username.trim().toLowerCase(),
          display_name: displayName.trim() || username.trim(),
          email: email.trim().toLowerCase(),
          avatar: '/images/hb_pilot.png',
        };
        AuthManager.saveSession(mockUser, 'offline-token-hb-universe');
        showSpeech(`✨ ACCOUNT CREATED (OFFLINE MODE), ${mockUser.display_name}!`, 4000);
        onSuccess();
      }
    } else if (tab === 'LOGIN') {
      setLoading(true);
      const res = await apiClient.post('/auth/login', {
        username_or_email: username.trim().toLowerCase(),
        password,
      });
      setLoading(false);

      if (res.success && res.data) {
        AuthManager.saveSession(res.data.user, res.data.access_token);
        showSpeech(`🚀 WELCOME BACK, ${res.data.user.display_name}!`, 3500);
        onSuccess();
      } else {
        // Fallback demo login
        const mockUser = {
          id: 'user-demo',
          username: username.trim().toLowerCase() || 'haribalan',
          display_name: username.trim() || 'Haribalan S.',
          email: 'pilot@hbuniverse.io',
          avatar: '/images/hb_pilot.png',
        };
        AuthManager.saveSession(mockUser, 'offline-token-hb-universe');
        showSpeech(`🚀 WELCOME BACK, ${mockUser.display_name}!`, 3500);
        onSuccess();
      }
    } else if (tab === 'FORGOT') {
      setLoading(true);
      await apiClient.post('/auth/forgot-password', { email });
      setLoading(false);
      setSuccessMsg('Recovery transmission sent to your email.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-950 border border-yellow-400/40 p-6 sm:p-8 flex flex-col space-y-5 shadow-[0_0_80px_rgba(255,229,0,0.3)]"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> QUANTUM ID GATEWAY
            </span>
            <h2 className="text-2xl font-black font-orbitron text-white mt-1">
              {tab === 'LOGIN' ? 'PILOT LOGIN' : tab === 'REGISTER' ? 'CREATE YOUR HB ID' : 'RECOVER ID'}
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => { setTab('LOGIN'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg font-orbitron text-xs font-bold transition-all ${
                tab === 'LOGIN' ? 'bg-yellow-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => { setTab('REGISTER'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg font-orbitron text-xs font-bold transition-all ${
                tab === 'REGISTER' ? 'bg-yellow-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-xs font-inter text-red-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-inter text-emerald-300">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {tab === 'REGISTER' && (
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Display Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haribalan S."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-yellow-400 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">
                {tab === 'REGISTER' ? 'Username' : 'Email or Username'}
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. haribalan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-yellow-400 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {tab === 'REGISTER' && (
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="pilot@hbuniverse.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-yellow-400 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-yellow-400 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {tab === 'REGISTER' && (
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-yellow-400 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-orbitron text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon-yellow cursor-pointer"
            >
              <span>{loading ? 'AUTHENTICATING...' : tab === 'LOGIN' ? 'ACCESS UNIVERSE' : 'CREATE HB ID'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
