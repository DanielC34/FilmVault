
import React from 'react';

interface GoogleLoginButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onPress, isLoading }) => {
  return (
    <button 
      onClick={onPress}
      disabled={isLoading}
      className="w-full py-4 bg-[#1a2128] border border-white/10 rounded-3xl flex items-center justify-center gap-4 text-white font-bold hover:bg-[#2c343c] active:scale-[0.98] transition-all group shadow-xl"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
            <path fill="#EA4335" d="M12 5.04c1.94 0 3.68.67 5.05 1.97l3.77-3.77C18.53 1.05 15.52 0 12 0 7.31 0 3.26 2.69 1.17 6.64l4.4 3.42C6.6 7.22 9.07 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.83-.07-1.63-.2-2.39H12v4.54h6.44c-.28 1.48-1.11 2.73-2.36 3.57l3.67 2.85c2.14-1.97 3.38-4.88 3.38-8.57z"/>
            <path fill="#FBBC05" d="M5.57 14.53c-.25-.75-.39-1.54-.39-2.36 0-.82.14-1.61.39-2.36l-4.4-3.42C.44 8.29 0 10.1 0 12s.44 3.71 1.17 5.36l4.4-3.42z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.67-2.85c-1.02.68-2.33 1.09-4.28 1.09-3.93 0-7.25-2.65-8.44-6.21l-4.4 3.42C3.26 21.31 7.31 24 12 24z"/>
          </svg>
          <span className="tracking-tight">Sign in with Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleLoginButton;
