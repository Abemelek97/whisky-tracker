import React from 'react';
import { Wine, Plus, HelpCircle, LogOut } from 'lucide-react';

export default function Navbar({ currentUser, onOpenNewDispatch, onOpenHelp, onLogout }) {
  const isSender = currentUser.role === 'sender' || currentUser.role === 'superadmin';

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              AmberVault Track
            </span>
            <span className="text-xs text-slate-400 block -mt-1">Dubai ➔ Addis Ababa Corridor</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.name.substring(0, 2)}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.name}</p>
              <span className="text-[10px] text-amber-400/90 font-mono">
                {currentUser.role === 'sender' ? 'Dubai Sender' : currentUser.role === 'receiver' ? 'Addis Receiver' : 'Super Admin'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenHelp}
            title="View Onboarding Walkthrough"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {isSender && (
            <button 
              onClick={onOpenNewDispatch}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Outbound (DXB)</span>
            </button>
          )}

          <button
            onClick={onLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg border border-slate-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}