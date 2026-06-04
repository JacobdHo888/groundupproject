import React from 'react';

export const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg shimmer-bg animate-shimmer"></div>
                    <div className="w-32 h-6 rounded shimmer-bg animate-shimmer"></div>
                </div>
                <div className="space-y-4">
                    <div className="w-full h-4 rounded shimmer-bg animate-shimmer"></div>
                    <div className="w-3/4 h-4 rounded shimmer-bg animate-shimmer"></div>
                    <div className="w-full h-8 rounded shimmer-bg animate-shimmer mt-4"></div>
                </div>
            </div>
        ))}
    </div>
);

export const ChatSkeleton = () => (
    <div className="space-y-6">
        <div className="flex flex-col items-end">
            <div className="w-2/3 h-12 rounded-2xl rounded-br-sm shimmer-bg animate-shimmer"></div>
        </div>
        <div className="flex flex-col items-start">
            <div className="w-3/4 h-24 rounded-2xl rounded-bl-sm shimmer-bg animate-shimmer"></div>
        </div>
        <div className="flex flex-col items-end">
            <div className="w-1/2 h-12 rounded-2xl rounded-br-sm shimmer-bg animate-shimmer"></div>
        </div>
    </div>
);

export const GoalsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between mb-5">
                    <div className="w-1/2 h-6 rounded shimmer-bg animate-shimmer"></div>
                    <div className="w-1/4 h-8 rounded shimmer-bg animate-shimmer"></div>
                </div>
                <div className="w-full h-3 rounded-full shimmer-bg animate-shimmer mb-3"></div>
                <div className="flex justify-between">
                    <div className="w-8 h-3 rounded shimmer-bg animate-shimmer"></div>
                    <div className="w-8 h-3 rounded shimmer-bg animate-shimmer"></div>
                    <div className="w-8 h-3 rounded shimmer-bg animate-shimmer"></div>
                </div>
            </div>
        ))}
    </div>
);

export const TransactionsSkeleton = () => (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-lg">
        <div className="w-full h-12 border-b border-dark-border shimmer-bg animate-shimmer"></div>
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-full h-16 border-b border-dark-border shimmer-bg animate-shimmer opacity-50"></div>
        ))}
    </div>
);
