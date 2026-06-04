import React from 'react';
import { FinancialProfile } from '../types';
import { WalletIcon, TrendingUpIcon, AlertCircleIcon, ZapIcon } from './Icons';
import { calculateHealthScore } from '../utils/finance';
import { CountUp } from './CountUp';
import { DashboardSkeleton } from './Skeletons';

interface DashboardProps {
    profile: FinancialProfile;
    isLoadingData?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, isLoadingData }) => {
    if (isLoadingData) return <div className="p-4 md:p-8"><DashboardSkeleton /></div>;

    const totalFixed = profile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVar = profile.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = totalFixed + totalVar;
    const totalDebtPayments = profile.debts.reduce((sum, d) => sum + (d.minimumPayment || 0), 0);
    const remaining = profile.income - totalExpenses - totalDebtPayments;
    const remainingPercent = profile.income > 0 ? (remaining / profile.income) * 100 : 0;
    
    const totalDebt = profile.debts.reduce((acc, d) => acc + d.amount, 0);
    const primaryGoal = profile.goals[0];

    const { score, label, color, hex } = calculateHealthScore(profile);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let budgetColor = 'text-brand-500';
    if (remainingPercent < 10) budgetColor = 'text-red-500';
    else if (remainingPercent < 20) budgetColor = 'text-yellow-500';

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Hey, {profile.firstName || 'there'} 👋</h1>
                    <p className="text-theme-muted mt-2 text-lg">Here's your financial snapshot.</p>
                </div>
                
                {/* Financial Health Score */}
                <div id="tour-health-score" className="flex items-center gap-4 bg-dark-card border border-dark-border p-4 rounded-2xl shadow-lg hover-scale">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-20 h-20">
                            <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-dark-border" />
                            <circle cx="40" cy="40" r={radius} stroke={hex} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1500 ease-out" strokeLinecap="round" />
                        </svg>
                        <span className={`absolute text-xl font-extrabold transition-colors duration-1000 ${color}`}>
                            <CountUp end={score} duration={1500} />
                        </span>
                    </div>
                    <div>
                        <div className="text-sm text-theme-muted font-bold uppercase tracking-wider">Health Score</div>
                        <div className={`text-xl font-bold ${color}`}>{label}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Budget */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg hover-scale">
                    <div className="flex items-center gap-3 mb-6 text-theme-text">
                        <div className="p-2 bg-dark-bg rounded-lg">
                            <WalletIcon className="w-5 h-5 text-brand-500" />
                        </div>
                        <h2 className="font-bold text-lg">Monthly Budget</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-base">
                            <span className="text-theme-muted font-medium">Income</span>
                            <span className="text-theme-text font-bold"><CountUp prefix="$" end={profile.income} /></span>
                        </div>
                        <div className="flex justify-between text-base">
                            <span className="text-theme-muted font-medium">Expenses</span>
                            <span className="text-theme-text font-bold">-<CountUp prefix="$" end={totalExpenses} /></span>
                        </div>
                        <div className="flex justify-between text-base">
                            <span className="text-theme-muted font-medium">Debt Payments</span>
                            <span className="text-theme-text font-bold">-<CountUp prefix="$" end={totalDebtPayments} /></span>
                        </div>
                        <div className="pt-4 border-t border-dark-border flex justify-between items-center">
                            <span className="font-bold text-theme-text text-lg">Remaining</span>
                            <span className={`text-2xl font-extrabold ${budgetColor}`}><CountUp prefix="$" end={remaining} /></span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Debt */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg hover-scale">
                    <div className="flex items-center gap-3 mb-6 text-theme-text">
                        <div className="p-2 bg-dark-bg rounded-lg">
                            <AlertCircleIcon className="w-5 h-5 text-brand-500" />
                        </div>
                        <h2 className="font-bold text-lg">Total Debt</h2>
                    </div>
                    <div className="text-4xl font-extrabold text-theme-text mb-3"><CountUp prefix="$" end={totalDebt} /></div>
                    {totalDebtPayments > 0 ? (
                        <p className="text-base text-theme-muted">
                            Est. payoff in <span className="text-brand-500 font-bold">{Math.ceil(totalDebt / totalDebtPayments)} months</span> at current rate.
                        </p>
                    ) : (
                        <p className="text-base text-theme-muted italic">No active debt payments recorded.</p>
                    )}
                </div>

                {/* Card 3: Savings */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg hover-scale">
                    <div className="flex items-center gap-3 mb-6 text-theme-text">
                        <div className="p-2 bg-dark-bg rounded-lg">
                            <TrendingUpIcon className="w-5 h-5 text-brand-500" />
                        </div>
                        <h2 className="font-bold text-lg">Primary Goal</h2>
                    </div>
                    {primaryGoal ? (
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <span className="font-bold text-theme-text text-lg">{primaryGoal.name}</span>
                                <span className="text-base font-medium text-theme-muted"><span className="text-theme-text"><CountUp prefix="$" end={primaryGoal.current} /></span> / ${primaryGoal.target.toLocaleString()}</span>
                            </div>
                            <div className="h-4 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                                <div 
                                    className="h-full bg-brand-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,230,118,0.8)]"
                                    style={{ width: `${Math.min(100, (primaryGoal.current / primaryGoal.target) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-base text-theme-muted italic">No goals set yet.</p>
                    )}
                </div>

                {/* Card 4: Quick Win */}
                <div id="tour-quick-win" className="bg-dark-card border-2 border-brand-500 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,230,118,0.15)] hover-scale">
                    <div className="flex items-center gap-3 mb-4 text-theme-text">
                        <div className="p-2 bg-brand-500/20 rounded-lg">
                            <ZapIcon className="w-6 h-6 text-brand-500" />
                        </div>
                        <h2 className="font-extrabold text-xl">Quick Win</h2>
                    </div>
                    <p className="text-theme-text font-medium text-lg leading-relaxed">
                        {profile.quickWin || "Chat with GroundUp to generate your personalized financial plan and get your first quick win!"}
                    </p>
                </div>
            </div>
        </div>
    );
};
