import React, { useState, useEffect } from 'react';
import { ShieldIcon } from './Icons';

interface PrivacyBannerProps {
    onAcknowledge: () => void;
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ onAcknowledge }) => {
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!expanded) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [expanded]);

    const handleDismiss = () => {
        setVisible(false);
        setTimeout(onAcknowledge, 300); // Wait for animation
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999] animate-[slideInUp_0.5s_ease-out]">
            <style>{`
                @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div className="bg-dark-card border border-brand-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-brand-500/10 rounded-lg shrink-0">
                        <ShieldIcon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                        <h3 className="text-theme-text font-bold mb-1">Your Data is Yours</h3>
                        <p className="text-theme-muted text-sm leading-relaxed">
                            GroundUp stores your financial data in your own MongoDB instance. We never sell or share your data.
                        </p>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 mb-4 pt-4 border-t border-dark-border space-y-2 text-sm text-theme-muted">
                        <p>• All data is stored in your personal MongoDB Atlas database.</p>
                        <p>• GroundUp uses Gemini AI to generate advice — your financial figures are sent to Google's API to generate responses.</p>
                        <p>• You can delete all your data at any time from your Profile page.</p>
                        <p>• No data is retained after deletion.</p>
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button 
                        onClick={handleDismiss}
                        className="flex-1 bg-brand-500 text-black font-bold py-2 rounded-lg hover-scale"
                    >
                        Got It
                    </button>
                    {!expanded && (
                        <button 
                            onClick={() => setExpanded(true)}
                            className="flex-1 bg-dark-bg border border-dark-border text-theme-text font-bold py-2 rounded-lg hover-scale"
                        >
                            Learn More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
