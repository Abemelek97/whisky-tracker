import React, { useState } from 'react';
import { Lock, Plus, Users, KeyRound } from 'lucide-react';
import { createRoom, joinRoom } from '../api';

export default function RoomSelectorModal({ isOpen, onClose, onRoomJoined, currentRoom }) {
  const [tab, setTab] = useState('join'); // 'join' | 'create'
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await joinRoom({ code, pin });
      onRoomJoined(res.room);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await createRoom({ name, code, pin });
      onRoomJoined(res.room);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Private Corridor Room</h3>
              <p className="text-xs text-slate-400">Connect DXB Senders & ADD Receivers</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        {currentRoom && (
          <div className="mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Active Room:</span>
            <span className="font-mono text-amber-400 font-bold">{currentRoom.name} ({currentRoom.code})</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-5">
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              tab === 'join' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Join Existing Room
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition cursor-pointer ${
              tab === 'create' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Create New Room
          </button>
        </div>

        {tab === 'join' ? (
          <form onSubmit={handleJoin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Code</label>
              <input
                type="text"
                required
                placeholder="e.g. DXB-ADD-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 uppercase font-mono outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room PIN</label>
              <input
                type="password"
                required
                placeholder="Secret access PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
            >
              {isLoading ? 'Connecting...' : 'Enter Private Room'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Terminal 3 to Bole Depot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Unique Code</label>
                <input
                  type="text"
                  required
                  placeholder="DXB-ADD-99"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 uppercase font-mono outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Secret PIN</label>
                <input
                  type="password"
                  required
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
            >
              {isLoading ? 'Creating...' : 'Create & Join Room'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}