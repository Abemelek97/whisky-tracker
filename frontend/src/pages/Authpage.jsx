import React, { useState } from 'react';
import { Wine, User, Phone, Lock } from 'lucide-react';
import { loginUser, registerUser } from '../api';

export default function AuthPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('sender');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const data = await registerUser({
          name: authName,
          phone: authPhone,
          password: authPassword,
          role: authRole
        });
        localStorage.setItem('ambervault_token', data.token);
        onLoginSuccess(data.user);
      } else {
        const data = await loginUser({
          phone: authPhone,
          password: authPassword
        });
        localStorage.setItem('ambervault_token', data.token);
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 mb-3">
            <Wine className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">AmberVault Track</h1>
          <p className="text-xs text-slate-400 mt-1">Phone-Verified Dubai ➔ Addis Whiskey Logistics</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              authMode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In with Phone
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              authMode === 'signup' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5">
                <User className="w-4 h-4 text-slate-500 mr-2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Elias Talefe"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none text-slate-200 placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Mobile Phone Number</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5">
              <Phone className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="tel"
                required
                placeholder="+251 9... or +971 50..."
                value={authPhone}
                onChange={(e) => setAuthPhone(e.target.value)}
                className="bg-transparent text-sm w-full outline-none text-slate-200 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5">
              <Lock className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="bg-transparent text-sm w-full outline-none text-slate-200 placeholder:text-slate-600"
              />
            </div>
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Operational Role</label>
              <select
                value={authRole}
                onChange={(e) => setAuthRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="sender">Sender Admin (Dubai Logistics)</option>
                <option value="receiver">Receiver Admin (Addis Ababa Depot)</option>
                <option value="superadmin">Logistics Controller (Super Admin)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-lg font-semibold text-sm transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {isLoading ? 'Verifying Phone...' : authMode === 'login' ? 'Sign In with Phone' : 'Register & Enter'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Authorized Admin Only • Corridor Hotline & Dispatch Security
        </div>
      </div>
    </div>
  );
}