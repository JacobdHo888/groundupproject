import React, { useState } from 'react';
import { FinancialProfile } from '../types';
import { calculateHealthScore, determineRoadmapPhase } from '../utils/finance';
import { Edit2Icon, Trash2Icon, DatabaseIcon } from './Icons';

interface ProfileProps {
    profile: FinancialProfile;
    onUpdateProfile: (updates: Partial<FinancialProfile>) => void;
    onDeleteData: () => void;
    onSendMessage: (msg: string) => void;
}

const InlineEdit: React.FC<{ value: string | number, onSave: (val: string) => void, type?: 'text' | 'number' }> = ({ value, onSave, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempVal, setTempVal] = useState(value.toString());

    if (isEditing) {
        return (
            <span className="inline-flex items-center gap-2">
                <input 
                    type={type} 
                    value={tempVal} 
                    onChange={e => setTempVal(e.target.value)}
                    className="bg-dark-bg border border-brand-500 text-theme-text px-2 py-0.5 rounded text-sm w-24 outline-none"
                    autoFocus
                />
                <button onClick={() => { onSave(tempVal); setIsEditing(false); }} className="text-brand-500 text-xs font-bold">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-theme-muted text-xs">Cancel</button>
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 group">
            <span className="font-bold text-theme-text">{type === 'number' ? `$${Number(value).toLocaleString()}` : value}</span>
            <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-theme-muted hover:text-brand-500">
                <Edit2Icon className="w-4 h-4" />
            </button>
        </span>
    );
};

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile, onDeleteData, onSendMessage }) => {
    const { score, label } = calculateHealthScore(profile);
    const phase = determineRoadmapPhase(profile);
    
    const totalFixed = profile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVar = profile.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDebt = profile.debts.reduce((sum, d) => sum + d.amount, 0);
    const primaryGoal = profile.goals[0];

    // Derive Financial Personality
    const remaining = profile.income - totalFixed - totalVar;
    const savingsRate = profile.income > 0 ? (remaining / profile.income) * 100 : 0;
    let personality = "Balanced Builder";
    if (savingsRate > 20) personality = "Aggressive Saver";
    else if (totalDebt > profile.income * 0.5) personality = "Debt Crusher";

    const handleSaveIncome = (val: string) => {
        const num = Number(val);
        if (!isNaN(num)) {
            onUpdateProfile({ income: num });
            onSendMessage(`I noticed you updated your income to $${num}. I've recalculated your plan.`);
        }
    };

    const handleSaveGoal = (val: string) => {
        if (primaryGoal && val.trim()) {
            const newGoals = [...profile.goals];
            newGoals[0].name = val;
            onUpdateProfile({ goals: newGoals });
            onSendMessage(`I noticed you updated your primary goal to ${val}. I've updated your plan.`);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Agent Memory</h1>
                <p className="text-theme-muted mt-2 text-lg">Everything GroundUp knows about you.</p>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 shadow-lg mb-8">
                <h2 className="text-xl font-bold text-theme-text mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    Your Financial Snapshot
                </h2>
                
                <ul className="space-y-6 text-lg text-theme-muted leading-relaxed">
                    <li>
                        You earn <InlineEdit value={profile.income} onSave={handleSaveIncome} type="number" />/month from {profile.employmentSituation.toLowerCase()}.
                    </li>
                    <li>
                        Your fixed expenses total <span className="font-bold text-theme-text">${totalFixed.toLocaleString()}</span>/month.
                    </li>
                    <li>
                        You have <span className="font-bold text-theme-text">{profile.debts.length}</span> active debts totaling <span className="font-bold text-theme-text">${totalDebt.toLocaleString()}</span>.
                    </li>
                    {primaryGoal && (
                        <li>
                            Your primary goal is <InlineEdit value={primaryGoal.name} onSave={handleSaveGoal} />.
                        </li>
                    )}
                    <li>
                        Your financial personality is <span className="font-bold text-theme-text">{personality}</span>.
                    </li>
                    <li>
                        Your financial health score is <span className="font-bold text-theme-text">{score} ({label})</span>.
                    </li>
                    <li>
                        You are in <span className="font-bold text-theme-text">Phase {phase}</span> of your Broke to Stable journey.
                    </li>
                </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <h3 className="font-bold text-theme-text mb-4">System Status</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-theme-muted">Data Source</span>
                            <span className="flex items-center gap-1.5 text-brand-500 font-medium bg-brand-500/10 px-2.5 py-1 rounded-md">
                                <DatabaseIcon className="w-4 h-4" /> MongoDB Connected ✅
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-theme-muted">Account Created</span>
                            <span className="text-theme-text font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Today'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-theme-muted">Account Type</span>
                            <span className="text-theme-text font-medium">{profile.isGuest ? 'Guest (Local)' : 'Registered'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-red-500 mb-2">Danger Zone</h3>
                        <p className="text-sm text-theme-muted mb-4">Permanently delete all your data from MongoDB. This action cannot be undone.</p>
                    </div>
                    <button 
                        onClick={() => {
                            if (window.confirm("Are you absolutely sure you want to delete all your data?")) {
                                onDeleteData();
                            }
                        }}
                        className="flex items-center justify-center gap-2 w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 font-bold py-3 rounded-xl transition-colors"
                    >
                        <Trash2Icon className="w-5 h-5" />
                        Delete All My Data
                    </button>
                </div>
            </div>
        </div>
    );
};
