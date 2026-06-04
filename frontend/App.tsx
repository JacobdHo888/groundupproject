import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Goals } from './components/Goals';
import { Transactions } from './components/Transactions';
import { Roadmap } from './components/Roadmap';
import { Share } from './components/Share';
import { Landing } from './components/Landing';
import { Tour } from './components/Tour';
import { PrivacyBanner } from './components/PrivacyBanner';
import { Profile } from './components/Profile';
import { ChatMessage, FinancialProfile } from './types';
import { AgentService } from './services/agentService';
import { MongoDbService } from './services/mongoDbService';
import { calculateHealthScore } from './utils/finance';
import confetti from 'canvas-confetti';

const INITIAL_PROFILE: FinancialProfile = {
    firstName: '',
    age: '',
    employmentSituation: '',
    income: 0,
    fixedExpenses: [],
    variableExpenses: [],
    debts: [],
    goals: [],
    transactions: [],
    tonePreference: 'chill',
    quickWin: '',
    theme: 'dark',
    tooltipsCompleted: false,
    privacyAcknowledged: false,
    isGuest: false
};

export default function App() {
    const [isDbLoaded, setIsDbLoaded] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [profile, setProfile] = useState<FinancialProfile>(INITIAL_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    
    // Share Link State
    const [sharedProfile, setSharedProfile] = useState<FinancialProfile | null>(null);
    const [isSharedView, setIsSharedView] = useState(false);

    const agentServiceRef = useRef<AgentService | null>(null);
    const pendingToolCallsRef = useRef<{name: string, args: any}[]>([]);
    const prevProfileRef = useRef<FinancialProfile | null>(null);

    // 0. Check for Share Link Hash
    useEffect(() => {
        const checkHash = async () => {
            const hash = window.location.hash;
            if (hash.startsWith('#share/')) {
                const token = hash.replace('#share/', '');
                const data = await MongoDbService.getSharedCard(token);
                if (data) {
                    setSharedProfile(data);
                    setIsSharedView(true);
                }
            } else {
                setIsSharedView(false);
            }
        };
        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    // 1. Load data from MongoDB (simulated) on mount
    useEffect(() => {
        if (isSharedView) return; // Skip loading personal DB if viewing a shared link

        const loadDatabase = async () => {
            const savedProfile = await MongoDbService.getProfile();
            const chatData = await MongoDbService.getChatData();
            
            if (savedProfile) {
                setProfile(savedProfile);
                if (savedProfile.firstName) {
                    setShowLanding(false);
                }
                if (savedProfile.theme) {
                    document.documentElement.setAttribute('data-theme', savedProfile.theme);
                }
            }

            // Initialize Agent with loaded history
            agentServiceRef.current = new AgentService(
                savedProfile || INITIAL_PROFILE,
                chatData.history || [],
                setProfile,
                (toolName, args) => {
                    pendingToolCallsRef.current.push({ name: toolName, args });
                }
            );

            setIsDbLoaded(true);
        };
        
        loadDatabase();
    }, [isSharedView]);

    // 2. Keep Agent profile state in sync and check for celebrations
    useEffect(() => {
        if (agentServiceRef.current && isDbLoaded && !isSharedView) {
            agentServiceRef.current.updateProfileState(profile);

            // Celebration Logic
            if (prevProfileRef.current) {
                const prev = prevProfileRef.current;
                
                // Goal Completed
                const newlyAchievedGoal = profile.goals.find(g => 
                    g.achieved && !prev.goals.find(pg => pg.id === g.id)?.achieved
                );
                if (newlyAchievedGoal) {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#00e676', '#ffffff'] });
                }

                // Debt Paid Off
                const prevDebtTotal = prev.debts.reduce((sum, d) => sum + d.amount, 0);
                const currentDebtTotal = profile.debts.reduce((sum, d) => sum + d.amount, 0);
                if (prevDebtTotal > 0 && currentDebtTotal === 0) {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#00e676', '#ffbb33'] });
                }

                // Health Score > 70
                const prevScore = calculateHealthScore(prev).score;
                const currentScore = calculateHealthScore(profile).score;
                if (prevScore <= 70 && currentScore > 70 && !profile.firstThrivingAt) {
                    const newProfile = { ...profile, firstThrivingAt: new Date().toISOString() };
                    setProfile(newProfile);
                    MongoDbService.saveProfile(newProfile);
                    
                    setMessages(msgs => [...msgs, {
                        id: Date.now().toString(),
                        role: 'model',
                        text: "Your financial health just hit Thriving territory. You're doing something most people never do. 🌱",
                        timestamp: Date.now()
                    }]);
                }
            }
            prevProfileRef.current = profile;
        }
    }, [profile, isDbLoaded, isSharedView]);

    const handleSendMessage = useCallback(async (text: string, isRecapTrigger = false) => {
        if (!text.trim() || !agentServiceRef.current) return;

        let updatedMessages = [...messages];

        if (!isRecapTrigger) {
            const userMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                text: text,
                timestamp: Date.now()
            };
            updatedMessages.push(userMsg);
            setMessages(updatedMessages);
        }
        
        setIsLoading(true);
        pendingToolCallsRef.current = [];

        try {
            const response = await agentServiceRef.current.sendMessage(text);
            
            const modelMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text,
                confidence: response.confidence,
                toolCalls: [...pendingToolCallsRef.current],
                timestamp: Date.now(),
                isRecap: isRecapTrigger
            };

            updatedMessages.push(modelMsg);
            setMessages(updatedMessages);

            await MongoDbService.saveChatData(updatedMessages, agentServiceRef.current.getHistory());

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "Sorry, I encountered an error processing that request.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
            pendingToolCallsRef.current = [];
        }
    }, [messages]);

    const handleOnboardingComplete = async (data: Partial<FinancialProfile>) => {
        const newProfile = { ...profile, ...data, createdAt: new Date().toISOString() } as FinancialProfile;
        setProfile(newProfile);
        setShowOnboarding(false);
        setCurrentView('dashboard');
        
        await MongoDbService.saveProfile(newProfile);
        
        if (agentServiceRef.current) {
            agentServiceRef.current.updateProfileState(newProfile);
            if (newProfile.demoMode) {
                handleSendMessage("Generate my weekly financial recap based on my profile.", true);
            } else {
                handleSendMessage("I just completed onboarding. Please save my profile, generate my initial financial plan, and give me a quick win.");
            }
        }
    };

    const toggleTheme = async () => {
        const newTheme = profile.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        const newProfile = { ...profile, theme: newTheme };
        setProfile(newProfile);
        await MongoDbService.saveProfile(newProfile);
    };

    const handleTourComplete = async () => {
        const newProfile = { ...profile, tooltipsCompleted: true };
        setProfile(newProfile);
        await MongoDbService.saveProfile(newProfile);
    };

    const handlePrivacyAcknowledge = async () => {
        const newProfile = { ...profile, privacyAcknowledged: true };
        setProfile(newProfile);
        await MongoDbService.saveProfile(newProfile);
    };

    const handleResetApp = async () => {
        await MongoDbService.clearAll();
        window.location.hash = '';
        window.location.reload();
    };

    const handleMigrateGuest = async () => {
        const newProfile = { ...profile, isGuest: false };
        setProfile(newProfile);
        await MongoDbService.saveProfile(newProfile);
        setShowSignupModal(false);
        alert("Your data has been saved. Welcome to GroundUp! 🎉");
    };

    // Render Shared View
    if (isSharedView && sharedProfile) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 font-sans">
                <Share profile={sharedProfile} agentService={null} isReadOnly={true} />
                <button 
                    onClick={() => { window.location.hash = ''; window.location.reload(); }} 
                    className="mt-8 bg-brand-500 text-black font-extrabold py-4 px-8 rounded-xl hover-scale shadow-md"
                >
                    Build your own at GroundUp
                </button>
            </div>
        );
    }

    if (!isDbLoaded) {
        return <div className="h-screen w-full bg-dark-bg flex items-center justify-center text-brand-500 font-bold">Connecting to MongoDB MCP...</div>;
    }

    if (showLanding) {
        return <Landing 
            onGetStarted={() => { setShowLanding(false); setShowOnboarding(true); }} 
            onTryDemo={() => { setShowLanding(false); setShowOnboarding(true); }} 
            onContinueGuest={() => { 
                setProfile(prev => ({ ...prev, isGuest: true }));
                setShowLanding(false); 
                setShowOnboarding(true); 
            }}
        />;
    }

    if (showOnboarding) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    return (
        <div className="flex flex-col h-screen w-full bg-dark-bg overflow-hidden font-sans">
            {profile.demoMode && (
                <div className="bg-brand-500 text-black text-center text-xs font-bold py-1.5 tracking-wide z-50 flex justify-center items-center gap-4">
                    <span>👀 DEMO MODE — Read-only. Sign up to save your real data.</span>
                    <button onClick={handleResetApp} className="underline hover:text-gray-800">Reset App</button>
                </div>
            )}
            {profile.isGuest && !profile.demoMode && (
                <div className="bg-yellow-500 text-black text-center text-xs font-bold py-2 px-4 z-50 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                    <span>Guest Mode — your data is saved locally only. Sign up to keep it safe.</span>
                    <button onClick={() => setShowSignupModal(true)} className="bg-black text-yellow-500 px-3 py-1 rounded-full hover:bg-gray-900 transition-colors">Save My Data →</button>
                </div>
            )}
            {!profile.demoMode && !profile.isGuest && (
                <div className="absolute top-4 right-4 z-50 hidden md:block">
                    <button onClick={() => { if(window.confirm("Reset app?")) handleResetApp(); }} className="text-xs text-theme-muted hover:text-red-400 transition-colors">Reset Data</button>
                </div>
            )}
            
            {profile.firstName && !profile.tooltipsCompleted && currentView === 'dashboard' && (
                <Tour onComplete={handleTourComplete} />
            )}

            {profile.firstName && !profile.privacyAcknowledged && !profile.demoMode && (
                <PrivacyBanner onAcknowledge={handlePrivacyAcknowledge} />
            )}

            {showSignupModal && (
                <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-dark-card border border-dark-border p-8 rounded-3xl w-full max-w-md">
                        <h2 className="text-2xl font-bold text-theme-text mb-4">Save Your Data</h2>
                        <p className="text-theme-muted mb-6">Create an account to securely store your financial plan in MongoDB.</p>
                        <div className="space-y-4 mb-6">
                            <input type="email" placeholder="Email" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-brand-500" />
                            <input type="password" placeholder="Password" className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-theme-text outline-none focus:border-brand-500" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSignupModal(false)} className="flex-1 bg-dark-bg text-theme-text font-bold py-3 rounded-xl">Cancel</button>
                            <button onClick={handleMigrateGuest} className="flex-1 bg-brand-500 text-black font-bold py-3 rounded-xl">Sign Up</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                <Navigation 
                    currentView={currentView} 
                    setCurrentView={setCurrentView} 
                    theme={profile.theme || 'dark'}
                    onToggleTheme={toggleTheme}
                />
                
                <main className="flex-1 h-full relative">
                    {currentView === 'dashboard' && <Dashboard profile={profile} isLoadingData={!isDbLoaded} />}
                    {currentView === 'chat' && (
                        <Chat 
                            messages={messages} 
                            onSendMessage={handleSendMessage} 
                            isLoading={isLoading}
                            isLoadingHistory={!isDbLoaded}
                            tone={profile.tonePreference}
                            onToggleTone={async () => {
                                const newTone = profile.tonePreference === 'chill' ? 'serious' : 'chill';
                                const newProfile = { ...profile, tonePreference: newTone };
                                setProfile(newProfile);
                                await MongoDbService.saveProfile(newProfile);
                            }}
                        />
                    )}
                    {currentView === 'goals' && <Goals profile={profile} isLoadingData={!isDbLoaded} />}
                    {currentView === 'transactions' && <Transactions profile={profile} isLoadingData={!isDbLoaded} />}
                    {currentView === 'roadmap' && <Roadmap profile={profile} />}
                    {currentView === 'share' && <Share profile={profile} agentService={agentServiceRef.current} />}
                    {currentView === 'profile' && (
                        <Profile 
                            profile={profile} 
                            onUpdateProfile={async (updates) => {
                                const newProfile = { ...profile, ...updates };
                                setProfile(newProfile);
                                await MongoDbService.saveProfile(newProfile);
                            }}
                            onDeleteData={handleResetApp}
                            onSendMessage={(msg) => handleSendMessage(msg, true)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
