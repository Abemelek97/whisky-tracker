import React, { useState } from 'react';
import { Lock, Plus, Users, KeyRound, Radio, LogOut, CheckCircle2 } from 'lucide-react';
import { createRoom, joinRoom, leaveRoom } from '../api';

export default function RoomSelectorModal({ isOpen, onClose, currentRoom, onRoomUpdated }) {
  const [tab, setTab] = useState(currentRoom ? 'status' : 'join'); // 'status' | 'join' | 'create'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await joinRoom({ code, pin });
      onRoomUpdated(res.room);
      setTab('status');
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
      onRoomUpdated(res.room);
      setTab('status');
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('Leave this private room? You will only see shipments once you rejoin.')) return;
    try {
      await leaveRoom();
      onRoomUpdated(null);
      setTab('join');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Private Vault Room</h3>
              <p className="text-xs text-slate-400">Restricted Sender ➔ Receiver Channel</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-5 text-xs">
          {currentRoom && (
            <button
              onClick={() => setTab('status')}
              className={`flex-1 py-2 font-semibold rounded-md transition cursor-pointer ${
                tab === 'status' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Under The Hood
            </button>
          )}
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 font-semibold rounded-md transition cursor-pointer ${
              tab === 'join' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Join Room
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 font-semibold rounded-md transition cursor-pointer ${
              tab === 'create' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Room
          </button>
        </div>

        {/* TAB 1: UNDER THE HOOD (LIVE ROOM STATUS & MEMBERS) */}
        {tab === 'status' && currentRoom && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Vault Name:</span>
                <span className="text-sm font-bold text-slate-200">{currentRoom.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Shareable Room Code:</span>
                <span className="font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold">
                  {currentRoom.code}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Room PIN:</span>
                <span className="font-mono text-slate-300 text-xs">{currentRoom.pin}</span>
              </div>
            </div>

            {/* Connected Members */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Connected Parties (Dubai & Addis)
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(currentRoom.users || []).map((u) => (
                  <div key={u.id} className="flex justify-between items-center p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <p className="font-semibold text-slate-200">{u.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">{u.phone}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      u.role === 'sender' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.role === 'sender' ? 'Dubai Sender' : 'Addis Receiver'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLeave}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        )}

        {/* TAB 2: JOIN EXISTING ROOM */}
        {tab === 'join' && (
          <form onSubmit={handleJoin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Code</label>
              <input
                type="text"
                required
                placeholder="e.g. DXB-ADDIS-01"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 uppercase font-mono outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Secret PIN</label>
              <input
                type="password"
                required
                placeholder="Enter PIN shared by sender/receiver"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition cursor-pointer text-xs"
            >
              {isLoading ? 'Connecting...' : 'Connect to Room'}
            </button>
          </form>
        )}

        {/* TAB 3: CREATE OWN ROOM */}
        {tab === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dubai Central ➔ Bole VIP Vault"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Room Code</label>
                <input
                  type="text"
                  required
                  placeholder="DXB-ADD-77"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 uppercase font-mono outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Secret PIN</label>
                <input
                  type="password"
                  required
                  placeholder="e.g. 1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition cursor-pointer text-xs"
            >
              {isLoading ? 'Creating...' : 'Create & Enter Room'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}