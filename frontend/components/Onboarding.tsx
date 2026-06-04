import React, { useState } from 'react';
import { FinancialProfile } from '../types';
import { DEMO_PROFILE } from '../constants';
import confetti from 'canvas-confetti';

interface OnboardingProps {
    onComplete: (profile: Partial<FinancialProfile>) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState<Partial<FinancialProfile>>({
        firstName: '', age: '', employmentSituation: 'Full-time job',
        income: 0, fixedExpenses: [], variableExpenses: [], debts: [], goals: []
    });

    const handleNext = () => {
        setDirection('forward');
        setStep(s => s + 1);
    };

    const handleBack = () => {
        setDirection('backward');
        setStep(s => s - 1);
    };
    
    const handleSubmit = () => {
        setIsSubmitting(true);
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00e676', '#ffffff', '#33ff99']
        });
        
        setTimeout(() => {
            onComplete(data);
        }, 2500);
    };

    const handleDemoMode = () => {
        onComplete(DEMO_PROFILE);
    };

    // Simple CSS transition classes based on direction
    const slideClass = direction === 'forward' ? 'animate-[slideInRight_0.4s_ease-out]' : 'animate-[slideInLeft_0.4s_ease-out]';

    if (isSubmitting) {
        return (
            <div className="fixed inset-0 bg-dark-bg z-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-6 animate-pulse-glow">
                    <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-3xl font-extrabold text-theme-text mb-2 text-center">You're all set, {data.firstName}!</h2>
                <p className="text-theme-muted text-lg">Let's build your plan.</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-dark-bg/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
            <style>{`
                @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
            
            <div className="bg-dark-card w-full max-w-md rounded-3xl border border-dark-border p-8 shadow-2xl relative overflow-hidden">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-3xl font-extrabold text-theme-text tracking-tight">Welcome</h2>
                        <span className="text-sm text-brand-500 font-bold bg-brand-500/10 px-3 py-1 rounded-full">Step {step} of 3</span>
                    </div>
                    <div className="h-2.5 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                        <div className="h-full bg-brand-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,230,118,0.8)]" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>
                </div>

                <div key={step} className={slideClass}>
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">First Name</label>
                                <input type="text" value={data.firstName} onChange={e => setData({...data, firstName: e.target.value})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="e.g. Alex" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Age</label>
                                <input type="number" value={data.age} onChange={e => setData({...data, age: e.target.value})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="e.g. 24" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Employment</label>
                                <select value={data.employmentSituation} onChange={e => setData({...data, employmentSituation: e.target.value})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all">
                                    <option>Full-time job</option>
                                    <option>Part-time job</option>
                                    <option>Freelance/Gig worker</option>
                                    <option>Student</option>
                                    <option>Unemployed/Job hunting</option>
                                </select>
                            </div>
                            <button onClick={handleNext} disabled={!data.firstName} className="w-full bg-brand-500 text-black font-extrabold py-4 rounded-xl mt-8 disabled:opacity-50 hover-scale shadow-md">Next</button>
                            
                            <div className="mt-6 text-center">
                                <span className="text-theme-muted text-sm">or</span>
                                <button onClick={handleDemoMode} className="block w-full mt-2 text-brand-500 hover:text-brand-400 font-bold text-sm underline underline-offset-4 transition-colors">
                                    Try Demo Mode (Pre-loaded Data)
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Monthly Take-Home Income</label>
                                <input type="number" value={data.income || ''} onChange={e => setData({...data, income: Number(e.target.value)})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="$" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Total Fixed Expenses (Rent, Utilities)</label>
                                <input type="number" onChange={e => setData({...data, fixedExpenses: [{id: '1', name: 'Fixed', amount: Number(e.target.value)}]})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="$" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Total Variable Expenses (Food, Fun)</label>
                                <input type="number" onChange={e => setData({...data, variableExpenses: [{id: '2', name: 'Variable', amount: Number(e.target.value)}]})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="$" />
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={handleBack} className="flex-1 bg-dark-bg border border-dark-border text-theme-text font-extrabold py-4 rounded-xl hover-scale shadow-md">Back</button>
                                <button onClick={handleNext} className="flex-1 bg-brand-500 text-black font-extrabold py-4 rounded-xl hover-scale shadow-md">Next</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-theme-text mb-2">Total Debt Balance (Loans, Cards)</label>
                                <input type="number" onChange={e => setData({...data, debts: [{id: '1', name: 'Total Debt', amount: Number(e.target.value)}]})} className="w-full bg-dark-bg border-2 border-dark-border rounded-xl px-4 py-3.5 text-theme-text font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" placeholder="$" />
                            </div>
                            <div className="p-5 bg-dark-bg border-2 border-dark-border rounded-2xl">
                                <h3 className="text-base font-extrabold text-theme-text mb-4">Primary Savings Goal</h3>
                                <div className="space-y-4">
                                    <input type="text" onChange={e => setData({...data, goals: [{...data.goals?.[0], id: '1', name: e.target.value, target: data.goals?.[0]?.target || 0, current: data.goals?.[0]?.current || 0}]})} className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-theme-text font-medium outline-none focus:border-brand-500" placeholder="Goal Name (e.g. Emergency Fund)" />
                                    <input type="number" onChange={e => setData({...data, goals: [{...data.goals?.[0], id: '1', name: data.goals?.[0]?.name || '', target: Number(e.target.value), current: data.goals?.[0]?.current || 0}]})} className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-theme-text font-medium outline-none focus:border-brand-500" placeholder="Target Amount $" />
                                    <input type="number" onChange={e => setData({...data, goals: [{...data.goals?.[0], id: '1', name: data.goals?.[0]?.name || '', target: data.goals?.[0]?.target || 0, current: Number(e.target.value)}]})} className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-theme-text font-medium outline-none focus:border-brand-500" placeholder="Current Saved $" />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={handleBack} className="flex-1 bg-dark-bg border border-dark-border text-theme-text font-extrabold py-4 rounded-xl hover-scale shadow-md">Back</button>
                                <button onClick={handleSubmit} className="flex-1 bg-brand-500 text-black font-extrabold py-4 rounded-xl hover-scale shadow-md">Build My Plan</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
