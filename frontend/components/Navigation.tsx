import React from 'react';
import { HomeIcon, MessageCircleIcon, TargetIcon, ListIcon, MapIcon, ShareIcon, UserIcon } from './Icons';

interface NavProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

export const Navigation: React.FC<NavProps> = ({ currentView, setCurrentView, theme, onToggleTheme }) => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: HomeIcon, tourId: '' },
        { id: 'chat', label: 'Chat', icon: MessageCircleIcon, tourId: 'tour-nav-chat' },
        { id: 'goals', label: 'Goals', icon: TargetIcon, tourId: 'tour-nav-goals' },
        { id: 'transactions', label: 'Log', icon: ListIcon, tourId: '' },
        { id: 'roadmap', label: 'Roadmap', icon: MapIcon, tourId: 'tour-nav-roadmap' },
        { id: 'share', label: 'Share', icon: ShareIcon, tourId: '' },
        { id: 'profile', label: 'Profile', icon: UserIcon, tourId: '' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 h-full bg-dark-card border-r border-dark-border p-4 relative">
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.4)]">
                            <TargetIcon className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-extrabold text-theme-text tracking-tight">GroundUp</span>
                    </div>
                    <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-dark-border text-theme-muted transition-colors" title="Toggle Theme">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto relative">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            id={item.tourId || undefined}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 relative z-10 ${
                                currentView === item.id 
                                    ? 'text-black font-bold' 
                                    : 'text-theme-muted hover:bg-dark-border hover:text-theme-text font-medium'
                            }`}
                        >
                            {currentView === item.id && (
                                <div className="absolute inset-0 bg-brand-500 rounded-xl shadow-[0_4px_14px_rgba(0,230,118,0.25)] -z-10 transition-all duration-300"></div>
                            )}
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-card border-t border-dark-border pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] overflow-x-auto">
                <nav className="flex justify-start sm:justify-around p-2 min-w-max relative">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            id={item.tourId ? `${item.tourId}-mobile` : undefined}
                            onClick={() => setCurrentView(item.id)}
                            className={`flex flex-col items-center p-2 min-w-[72px] transition-colors relative z-10 ${
                                currentView === item.id ? 'text-brand-500' : 'text-theme-muted hover:text-theme-text'
                            }`}
                        >
                            <div className={`p-1.5 rounded-lg mb-1 transition-colors duration-300 ${currentView === item.id ? 'bg-brand-500/10' : ''}`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Mobile Theme Toggle (Top Right) */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button onClick={onToggleTheme} className="p-2 rounded-full bg-dark-card border border-dark-border text-theme-text shadow-md">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </>
    );
};
