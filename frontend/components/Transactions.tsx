import React from 'react';
import { FinancialProfile } from '../types';
import { ListIcon, PlusIcon } from './Icons';
import { CountUp } from './CountUp';
import { TransactionsSkeleton } from './Skeletons';

interface TransactionsProps {
    profile: FinancialProfile;
    isLoadingData?: boolean;
}

export const Transactions: React.FC<TransactionsProps> = ({ profile, isLoadingData }) => {
    if (isLoadingData) return <div className="p-4 md:p-8"><TransactionsSkeleton /></div>;

    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthlyIncome = profile.transactions
        .filter(t => t.type === 'income' && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.amount, 0);
        
    const monthlyExpense = profile.transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-theme-text tracking-tight">Transactions</h1>
                    <p className="text-theme-muted mt-2 text-lg">Your recent activity.</p>
                </div>
                <button className="flex items-center gap-2 bg-dark-card border border-dark-border text-theme-text hover:border-brand-500 transition-colors px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover-scale">
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Add</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg hover-scale">
                    <div className="text-base font-medium text-theme-muted mb-2">Income (This Month)</div>
                    <div className="text-3xl font-extrabold text-brand-500"><CountUp prefix="$" end={monthlyIncome} /></div>
                </div>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg hover-scale">
                    <div className="text-base font-medium text-theme-muted mb-2">Expenses (This Month)</div>
                    <div className="text-3xl font-extrabold text-theme-text"><CountUp prefix="$" end={monthlyExpense} /></div>
                </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-lg">
                {profile.transactions.length === 0 ? (
                    <div className="text-center py-16">
                        <ListIcon className="w-10 h-10 text-theme-muted mx-auto mb-4" />
                        <p className="text-theme-text font-medium text-lg">No transactions logged yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-base">
                            <thead className="bg-dark-bg text-theme-text border-b border-dark-border">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Date</th>
                                    <th className="px-6 py-4 font-bold">Description</th>
                                    <th className="px-6 py-4 font-bold">Category</th>
                                    <th className="px-6 py-4 font-bold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {profile.transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-dark-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-theme-muted font-medium">{tx.date}</td>
                                        <td className="px-6 py-4 text-theme-text font-medium">{tx.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-dark-bg border border-dark-border px-3 py-1.5 rounded-md text-xs font-bold text-theme-text">
                                                {tx.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-extrabold ${tx.type === 'income' ? 'text-brand-500' : 'text-theme-text'}`}>
                                            {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
