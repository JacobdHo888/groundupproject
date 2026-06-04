import React from 'react';
import { FinancialProfile } from '../types';
import { determineRoadmapPhase } from '../utils/finance';
import { CheckCircleIcon } from './Icons';

interface RoadmapProps {
    profile: FinancialProfile;
}

export const Roadmap: React.FC<RoadmapProps> = ({ profile }) => {
    const currentPhase = determineRoadmapPhase(profile);

    const phases = [
        {
            id: 1,
            title: 'Survive',
            criteria: 'All monthly expenses covered by income',
            milestone: '$0 monthly deficit',
            action: 'Cut non-essentials or increase income to stop the bleeding.'
        },
        {
            id: 2,
            title: 'Stabilize',
            criteria: '$1,000 emergency fund built',
            milestone: 'Emergency Fund >= $1,000',
            action: 'Save every extra dollar until you hit $1k to prevent new debt.'
        },
        {
            id: 3,
            title: 'Grow',
            criteria: 'All high-interest debt (>15% APR) paid off',
            milestone: 'No toxic debt',
            action: 'Use the Avalanche method to crush credit card debt.'
        },
        {
            id: 4,
            title: 'Thrive',
            criteria: 'Primary savings goal reached',
            milestone: 'Goal Completed',
            action: 'Invest and build long-term wealth.'
        }
    ];

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Broke to Stable Roadmap</h1>
                <p className="text-theme-muted mt-2 text-lg">Your step-by-step path to financial freedom.</p>
            </div>

            <div className="relative max-w-3xl mx-auto">
                {/* Vertical Line */}
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-dark-border rounded-full hidden md:block"></div>

                <div className="space-y-8">
                    {phases.map((phase) => {
                        const isCompleted = currentPhase > phase.id;
                        const isActive = currentPhase === phase.id;
                        const isFuture = currentPhase < phase.id;

                        return (
                            <div key={phase.id} className={`relative flex flex-col md:flex-row gap-6 md:gap-10 items-start ${isFuture ? 'opacity-50' : ''}`}>
                                {/* Node */}
                                <div className="hidden md:flex relative z-10 w-16 h-16 shrink-0 items-center justify-center rounded-full border-4 transition-all duration-500 bg-dark-card" style={{ borderColor: isCompleted || isActive ? 'var(--accent)' : 'var(--border)' }}>
                                    {isCompleted ? (
                                        <div className="w-full h-full rounded-full bg-brand-500 flex items-center justify-center">
                                            <CheckCircleIcon className="w-8 h-8 text-black" />
                                        </div>
                                    ) : (
                                        <span className={`text-xl font-bold ${isActive ? 'text-brand-500' : 'text-theme-muted'}`}>{phase.id}</span>
                                    )}
                                    {isActive && <div className="absolute inset-0 rounded-full border-4 border-brand-500 animate-ping opacity-20"></div>}
                                </div>

                                {/* Card */}
                                <div className={`flex-1 bg-dark-card border-2 rounded-2xl p-6 transition-all duration-300 hover-scale ${isActive ? 'border-brand-500 shadow-lg' : 'border-dark-border'}`}>
                                    <div className="flex items-center gap-3 mb-2 md:hidden">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted ? 'bg-brand-500 text-black' : isActive ? 'border-2 border-brand-500 text-brand-500' : 'bg-dark-border text-theme-muted'}`}>
                                            {isCompleted ? '✓' : phase.id}
                                        </div>
                                        <h2 className="text-xl font-bold text-theme-text">Phase {phase.id}: {phase.title}</h2>
                                    </div>
                                    <h2 className="hidden md:block text-2xl font-bold text-theme-text mb-2">Phase {phase.id}: {phase.title}</h2>
                                    
                                    <div className="space-y-3">
                                        <p className="text-theme-muted font-medium">{phase.criteria}</p>
                                        <div className="bg-dark-bg rounded-lg p-3 border border-dark-border">
                                            <span className="text-xs text-theme-muted uppercase font-bold tracking-wider block mb-1">Milestone</span>
                                            <span className="text-theme-text font-bold">{phase.milestone}</span>
                                        </div>
                                        {isActive && (
                                            <div className="mt-4 p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl">
                                                <span className="text-xs text-brand-500 uppercase font-bold tracking-wider block mb-1">Next Action</span>
                                                <span className="text-theme-text font-medium">{phase.action}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
