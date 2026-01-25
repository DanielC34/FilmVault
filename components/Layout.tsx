
import React from 'react';
import { ICONS, THEME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'search' | 'lists' | 'profile';
  onTabChange: (tab: 'home' | 'search' | 'lists' | 'profile') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto shadow-2xl relative overflow-hidden" style={{ backgroundColor: THEME.background }}>
      {/* Header */}
      <header className="p-4 flex justify-between items-center sticky top-0 z-40 bg-[#14181c]/90 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <span style={{ color: THEME.primary }}>FILM</span>
          <span className="text-white">VAULT</span>
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-white/60 hover:text-white transition-colors">
            {ICONS.Search}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto z-50 p-4">
        <div className="bg-[#1a2128]/95 backdrop-blur-xl border border-white/10 rounded-3xl flex justify-around items-center py-3 shadow-2xl">
          <button 
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-[#00e054]' : 'text-white/40'}`}
          >
            {ICONS.Film}
            <span className="text-[10px] font-medium uppercase tracking-widest">Feed</span>
          </button>
          <button 
             onClick={() => onTabChange('search')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'search' ? 'text-[#00e054]' : 'text-white/40'}`}
          >
            {ICONS.Search}
            <span className="text-[10px] font-medium uppercase tracking-widest">Browse</span>
          </button>
          <button 
             onClick={() => onTabChange('lists')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'lists' ? 'text-[#00e054]' : 'text-white/40'}`}
          >
            {ICONS.List}
            <span className="text-[10px] font-medium uppercase tracking-widest">Vault</span>
          </button>
          <button 
             onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-[#00e054]' : 'text-white/40'}`}
          >
            {ICONS.User}
            <span className="text-[10px] font-medium uppercase tracking-widest">Me</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
