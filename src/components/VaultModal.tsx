import React, { useState } from 'react';
import { useJournalStore } from '../core/journal_store';
import { Lock, Unlock, Key, X, AlertCircle } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose }) => {
  const { isVaultLocked, unlockVault, lockVault, setVaultPasscode } = useJournalStore();
  const [passcode, setPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await unlockVault(passcode);
    if (ok) {
      setPasscode('');
      setSuccess('Vault unlocked successfully.');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1000);
    } else {
      setError('Incorrect passcode. Default passcode is 1234.');
    }
  };

  const handleLock = () => {
    lockVault();
    onClose();
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.length < 4) {
      setError('Passcode must be at least 4 characters long.');
      return;
    }
    setVaultPasscode(newPasscode);
    setNewPasscode('');
    setSuccess('Passcode updated successfully.');
    setTimeout(() => setSuccess(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
            {isVaultLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Private Dream Vault</h2>
            <p className="text-xs text-slate-400">Zero-knowledge AES-256 client-side encryption</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <Unlock className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {isVaultLocked ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Enter Vault Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter passcode (default: 1234)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <span>Vault is currently unlocked.</span>
              <button
                onClick={handleLock}
                className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Now
              </button>
            </div>

            <form onSubmit={handleChangePasscode} className="space-y-3 pt-2 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                Change Vault Passcode
              </label>
              <input
                type="password"
                required
                placeholder="New passcode (min 4 chars)"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-200 font-medium transition-colors"
              >
                Update Passcode
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
