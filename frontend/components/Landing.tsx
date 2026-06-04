import React from 'react';
import { MessageCircleIcon, TargetIcon, MapIcon } from './Icons';

interface LandingProps {
    onGetStarted: () => void;
    onTryDemo: () => void;
    onContinueGuest: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onGetStarted, onTryDemo, onContinueGuest }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-theme-text overflow-y-auto selection:bg-brand-500 selection:text-black">
            {/* Hero Section */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] animate-pulse-glow"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-8">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-theme-muted tracking-wide uppercase">GroundUp Agent</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                        Your money. Your terms.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Built for your generation.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-theme-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                        GroundUp helps Gen Z budget smarter, crush debt faster, and build real wealth — one conversation at a time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <button 
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-black font-extrabold rounded-xl hover-scale shadow-[0_0_20px_rgba(0,230,118,0.3)]"
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={onTryDemo}
                            className="w-full sm:w-auto px-8 py-4 bg-dark-card border-2 border-dark-border text-theme-text font-bold rounded-xl hover-scale hover:border-brand-500 transition-colors"
                        >
                            Try Demo
                        </button>
                    </div>
                    <button 
                        onClick={onContinueGuest}
                        className="text-theme-muted hover:text-theme-text font-medium text-sm underline underline-offset-4 transition-colors"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="py-24 px-4 bg-dark-card/50 border-y border-dark-border">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-dark-bg border border-dark-border p-8 rounded-3xl hover-scale">
                        <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <MessageCircleIcon className="w-7 h-7 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Talk To Your Money</h3>
                        <p className="text-theme-muted leading-relaxed">Chat naturally about your finances. Get a real, actionable plan without the confusing jargon.</p>
                    </div>
                    <div className="bg-dark-bg border border-dark-border p-8 rounded-3xl hover-scale">
                        <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <TargetIcon className="w-7 h-7 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">See The Full Picture</h3>
                        <p className="text-theme-muted leading-relaxed">A dashboard built around your life. Track your Health Score, goals, and quick wins instantly.</p>
                    </div>
                    <div className="bg-dark-bg border border-dark-border p-8 rounded-3xl hover-scale">
                        <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <MapIcon className="w-7 h-7 text-brand-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Know Your Next Move</h3>
                        <p className="text-theme-muted leading-relaxed">Follow a clear roadmap from broke to thriving. Always know exactly what to do next.</p>
                    </div>
                </div>
            </div>

            {/* Social Proof Strip */}
            <div className="py-16 px-4 text-center bg-brand-500 text-black">
                <p className="max-w-3xl mx-auto text-xl md:text-2xl font-bold leading-relaxed">
                    "Built for the generation dealing with student loans, high rent, and entry-level salaries. Finally, a tool that gets it."
                </p>
            </div>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-dark-border text-center md:text-left">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                            <span className="text-black font-bold">G</span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">GroundUp</span>
                    </div>
                    <div className="text-theme-muted text-sm font-medium">
                        Built for Google Cloud Rapid Agent Hackathon 2026
                    </div>
                </div>
            </footer>
        </div>
    );
};
