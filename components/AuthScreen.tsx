
import React, { useState } from 'react';
import { ICONS, THEME } from '../constants';
import GoogleLoginButton from './GoogleLoginButton';
import { useStore } from '../store/useStore';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

type AuthMode = 'login' | 'signup';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  const { signInWithGoogle, signInAsGuest, signInWithPassword, signUpWithEmail } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    
    if (authMode === 'login') {
      await signInWithPassword(email, password);
    } else if (authMode === 'signup') {
      const success = await signUpWithEmail(email, password);
      if (success) {
        // Supabase might return success but session is null if verification is required
        const currentSession = useStore.getState().session;
        if (!currentSession) {
          setSent(true);
        }
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#14181c] flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00e054]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ff8000]/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl mb-2">
            <div className="text-[#00e054] scale-150">{ICONS.Film}</div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            FILM<span className="text-[#00e054]">VAULT</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Premium Archive Access</p>
        </div>

        {!sent ? (
          <div className="space-y-8">
            <div className="flex bg-[#1a2128] p-1 rounded-2xl border border-white/5">
              <button 
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-[#2c343c] text-[#00e054] shadow-lg' : 'text-white/30'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-[#2c343c] text-[#00e054] shadow-lg' : 'text-white/30'}`}
              >
                Signup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cinephile@example.com"
                  className="w-full p-5 bg-[#1a2128] border border-white/5 rounded-3xl text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#00e054]/30 focus:ring-4 focus:ring-[#00e054]/5 transition-all shadow-inner"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-5 bg-[#1a2128] border border-white/5 rounded-3xl text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-[#00e054]/30 focus:ring-4 focus:ring-[#00e054]/5 transition-all shadow-inner pr-12"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-5 bg-[#00e054] text-black font-black rounded-3xl shadow-2xl shadow-[#00e054]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {authMode === 'login' ? 'ENTER VAULT' : 'INITIALIZE ACCOUNT'}
                    {ICONS.ChevronRight}
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 bg-[#14181c] text-[10px] font-black text-white/20 uppercase tracking-widest">Or Secure Entry via</span>
            </div>

            <GoogleLoginButton 
              onPress={() => signInWithGoogle()} 
              isLoading={loading}
            />

            <button 
              onClick={() => signInAsGuest()}
              className="w-full text-center text-[10px] text-white/30 font-black uppercase tracking-widest hover:text-[#00e054] transition-colors"
            >
              Developer Bypass (Guest Mode)
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#00e054]/10 rounded-full flex items-center justify-center mx-auto text-[#00e054] border border-[#00e054]/20">
                <div className="scale-125"><Sparkles /></div>
              </div>
              <h2 className="text-2xl font-black text-white">Verify Your Vault</h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-[280px] mx-auto">
                We've dispatched a verification link to <span className="text-white font-bold">{email}</span>. Please confirm your email to activate your account.
              </p>
            </div>
            
            <button 
              onClick={() => setSent(false)}
              className="text-[#00e054] text-xs font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
