
import React, { useState } from 'react';
import { ICONS, THEME } from '../constants';

interface CreateWatchlistModalProps {
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

const CreateWatchlistModal: React.FC<CreateWatchlistModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title, description);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
      <div className="bg-[#1a2128] w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">New Vault</h2>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <div className="rotate-45">{ICONS.Plus}</div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Vault Title</label>
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Oscar Nominees"
              className="w-full p-4 bg-[#14181c] border border-white/5 rounded-2xl text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#00e054]/30 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection about?"
              rows={3}
              className="w-full p-4 bg-[#14181c] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/10 focus:outline-none focus:border-[#00e054]/30 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!title.trim()}
              className="flex-2 py-4 px-8 bg-[#00e054] text-black font-black rounded-2xl shadow-lg shadow-[#00e054]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
            >
              CREATE VAULT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWatchlistModal;
