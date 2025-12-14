import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-xl border-x border-slate-200">
      <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {showBack && !isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowRight size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        </div>
        {!isHome && (
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          >
            <Home size={24} />
          </button>
        )}
      </header>
      <main className="flex-1 p-4 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;