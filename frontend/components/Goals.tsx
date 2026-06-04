import React from 'react';
import { FinancialProfile } from '../types';
import { TargetIcon, PlusIcon } from './Icons';
import { CountUp } from './CountUp';
import { GoalsSkeleton } from './Skeletons';

interface GoalsProps {
    profile: FinancialProfile;
    isLoadingData?: boolean;
}

export const Goals: React.FC<GoalsProps> = ({ profile, isLoadingData }) => {
    if (isLoadingData) return <div className="p-4 md:p-8"><GoalsSkeleton /></div>;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Goals Tracker</h1>
                    <p className="text-theme-muted mt-2 text-lg">Track your milestones.</p>
                </div>
                <button className="flex items-center gap-2 bg-dark-card border border-dark-border text-theme-text hover:border-brand-500 transition-colors px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover-scale">
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden md:inline">New Goal</span>
                </button>
            </div>

            {profile.goals.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-dark-border rounded-2xl bg-dark-card/50">
                    <TargetIcon className="w-10 h-10 text-theme-muted mx-auto mb-4" />
                    <p className="text-theme-text font-medium text-lg">No goals set yet. Ask GroundUp to create one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.goals.map(goal => {
                        const progress = Math.min(100, (goal.current / goal.target) * 100);
                        return (
                            <div key={goal.id} className="bg-dark-card border border-dark-border rounded-2xl p-6 relative overflow-hidden shadow-lg hover-scale">
                                {goal.achieved && (
                                    <div className="absolute top-0 right-0 bg-brand-500 text-black text-xs font-extrabold px-4 py-1.5 rounded-bl-xl shadow-sm animate-[pulse-glow_2s_infinite]">
                                        ACHIEVED
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-xl font-bold text-theme-text">{goal.name}</h3>
                                        {goal.targetDate && <p className="text-sm font-medium text-theme-muted mt-1">Target: <span className="text-theme-text">{goal.targetDate}</span></p>}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-extrabold text-brand-500"><CountUp prefix="$" end={goal.current} /></div>
                                        <div className="text-sm font-medium text-theme-muted">of <span className="text-theme-text">${goal.target.toLocaleString()}</span></div>
                                    </div>
                                </div>
                                
                                <div className="h-3 bg-dark-bg rounded-full overflow-hidden mb-3 border border-dark-border">
                                    <div className="h-full bg-brand-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,230,118,0.8)]" style={{ width: `${progress}%` }} />
                                </div>
                                
                                <div className="flex justify-between text-xs font-bold text-theme-muted">
                                    <span className={`transition-colors duration-500 ${progress >= 25 ? 'text-brand-500 scale-110' : ''}`}>25%</span>
                                    <span className={`transition-colors duration-500 ${progress >= 50 ? 'text-brand-500 scale-110' : ''}`}>50%</span>
                                    <span className={`transition-colors duration-500 ${progress >= 75 ? 'text-brand-500 scale-110' : ''}`}>75%</span>
                                    <span className={`transition-colors duration-500 ${progress >= 100 ? 'text-brand-500 scale-110' : ''}`}>100%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
