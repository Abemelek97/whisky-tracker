import React, { useState } from 'react';
import { Wine, User, Mail, Lock } from 'lucide-react';

export default function AuthPage({ onLogin }) {
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('sender');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: authMode === 'signup' ? authName : (authEmail.split('@')[0] || 'Admin User'),
      email: authEmail,
      role: authRole
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 mb-3">
            <Wine className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">AmberVault Track</h1>
          <p className="text-xs text-slate-400 mt-1">Cross-Border High-Value Spirit Logistics Portal</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              authMode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              authMode === 'signup' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
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
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5">
              <Mail className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="email"
                required
                placeholder="admin@ambervault.io"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Role</label>
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

          <button
            type="submit"
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-lg font-semibold text-sm transition shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {authMode === 'login' ? 'Enter Corridor Portal' : 'Register & Launch'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Authorized Personnel Only • Dubai / Addis Ababa Logistics Protocol
        </div>
      </div>
    </div>
  );
}