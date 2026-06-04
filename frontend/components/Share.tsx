import React, { useRef, useState, useEffect } from 'react';
import { FinancialProfile } from '../types';
import { calculateHealthScore, determineRoadmapPhase } from '../utils/finance';
import { DownloadIcon, ShareIcon } from './Icons';
import html2canvas from 'html2canvas';
import { AgentService } from '../services/agentService';
import { MongoDbService } from '../services/mongoDbService';

interface ShareProps {
    profile: FinancialProfile;
    agentService: AgentService | null;
    isReadOnly?: boolean;
}

export const Share: React.FC<ShareProps> = ({ profile, agentService, isReadOnly = false }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [tagline, setTagline] = useState("Loading your personalized motivation...");

    const { score } = calculateHealthScore(profile);
    const phase = determineRoadmapPhase(profile);
    const primaryGoal = profile.goals[0];
    const progress = primaryGoal ? Math.min(100, Math.round((primaryGoal.current / primaryGoal.target) * 100)) : 0;
    
    const totalDebt = profile.debts.reduce((sum, d) => sum + d.amount, 0);
    const totalSavings = profile.goals.reduce((sum, g) => sum + g.current, 0);
    const netWorth = totalSavings - totalDebt;

    useEffect(() => {
        const fetchTagline = async () => {
            if (agentService) {
                const generated = await agentService.generateTagline(score, phase, progress, primaryGoal?.name || 'financial freedom');
                setTagline(generated);
            } else {
                let defaultTagline = "Every dollar saved is a step forward. Keep going. 💪";
                if (score > 70) defaultTagline = "Thriving. You did the hard work. Now grow it. 🚀";
                else if (score > 40) defaultTagline = "You're building something real. Don't stop now. 🌱";
                setTagline(defaultTagline);
            }
        };
        fetchTagline();
    }, [agentService, score, phase, progress, primaryGoal]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#0f0f0f',
                scale: 2,
                logging: false,
                useCORS: true
            });
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `groundup-progress-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShareLink = async () => {
        const token = Math.random().toString(36).substring(2, 10);
        await MongoDbService.saveSharedCard(token, profile);
        window.location.hash = `share/${token}`;
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 flex flex-col items-center">
            {!isReadOnly && (
                <div className="w-full max-w-3xl mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Share Progress</h1>
                    <p className="text-theme-muted mt-2 text-lg">Flex your financial wins.</p>
                </div>
            )}

            {/* Scrollable wrapper for mobile to fit the 700x400 card */}
            <div className="w-full max-w-3xl overflow-x-auto pb-8 flex justify-center">
                {/* The Card to Capture (Fixed 700x400) */}
                <div 
                    ref={cardRef}
                    className="w-[700px] h-[400px] shrink-0 bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,230,118,0.15)] flex flex-col justify-between"
                    style={{ background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 100%)' }}
                >
                    {/* Subtle green glow in background */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#00e676]/20 rounded-full blur-[100px]"></div>
                    
                    {/* Top Row */}
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#00e676] flex items-center justify-center">
                                <span className="text-black font-bold text-lg">G</span>
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">GroundUp</span>
                        </div>
                        <div className="text-[#aaaaaa] font-medium text-sm">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    {/* Center Row */}
                    <div className="relative z-10 flex items-center justify-between px-4">
                        {/* Left: Score */}
                        <div className="text-center">
                            <div className="text-xs text-[#aaaaaa] font-bold uppercase tracking-widest mb-2">Health Score</div>
                            <div className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]">
                                {score}
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="space-y-4 w-64">
                            <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-4 backdrop-blur-sm">
                                <div className="text-xs text-[#aaaaaa] font-bold uppercase mb-1">Current Phase</div>
                                <div className="text-lg font-bold text-[#00e676]">Phase {phase}</div>
                            </div>

                            {primaryGoal && (
                                <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-4 backdrop-blur-sm">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-xs text-[#aaaaaa] font-bold uppercase truncate pr-2">{primaryGoal.name}</div>
                                        <div className="text-sm font-bold text-white">{progress}%</div>
                                    </div>
                                    <div className="h-2 bg-[#0f0f0f] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#00e676]" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            )}

                            <div className="bg-[#1a1a1a]/80 border border-[#2a2a2a] rounded-2xl p-4 backdrop-blur-sm flex justify-between items-center">
                                <div className="text-xs text-[#aaaaaa] font-bold uppercase">Net Worth</div>
                                <div className={`text-sm font-bold ${netWorth >= 0 ? 'text-white' : 'text-[#ffbb33]'}`}>
                                    {netWorth >= 0 ? `$${netWorth.toLocaleString()}` : 'Building...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="relative z-10 flex justify-between items-end">
                        <p className="text-lg font-medium text-white italic max-w-lg">"{tagline}"</p>
                        <div className="text-[#aaaaaa] text-xs font-bold tracking-wider opacity-50">groundup.app</div>
                    </div>
                </div>
            </div>

            {!isReadOnly && (
                <div className="flex gap-4 w-full max-w-md">
                    <button 
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="flex-1 flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-black font-extrabold py-4 rounded-xl transition-colors shadow-md disabled:opacity-50"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        {isGenerating ? 'Generating...' : 'Download Card'}
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 bg-dark-card border border-dark-border hover:bg-dark-border text-theme-text font-extrabold py-4 rounded-xl transition-colors shadow-md"
                        onClick={handleShareLink}
                    >
                        <ShareIcon className="w-5 h-5" />
                        Get Share Link
                    </button>
                </div>
            )}
        </div>
    );
};
