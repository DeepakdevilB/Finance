import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, LogOut, Languages } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function Layout() {
  const { signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: t('home'), icon: Home },
    { path: '/learning', label: t('learn'), icon: BookOpen },
    { path: '/coach', label: t('ai_coach'), icon: MessageSquare },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-emerald-600">{t('app_name')}</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isActive ? 'text-emerald-600 bg-emerald-50 font-medium' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Languages size={20} />
            <span>{language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
          </button>
          <button 
            onClick={signOut} 
            className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-emerald-600">{t('app_name')}</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 transition-colors"
              title="Switch Language"
            >
              <Languages size={20} />
              <span className="text-xs font-bold uppercase">{language === 'en' ? 'HI' : 'EN'}</span>
            </button>
            <button onClick={signOut} className="text-slate-500 hover:text-slate-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full p-4 pb-24 md:p-8 md:pb-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-10">
        <div className="max-w-md mx-auto flex justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                  isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={24} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
