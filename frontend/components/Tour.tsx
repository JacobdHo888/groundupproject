import React, { useState, useEffect } from 'react';

interface TourProps {
    onComplete: () => void;
}

export const Tour: React.FC<TourProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const steps = [
        { id: 'tour-health-score', text: 'This is your Financial Health Score. It updates as you log data.' },
        { id: 'tour-quick-win', text: 'Your agent found one action you can take today.' },
        { id: 'tour-nav-chat', text: 'Ask me anything about your finances. I remember your full situation.' },
        { id: 'tour-nav-goals', text: 'Track every goal here. I\'ll help you hit them faster.' },
        { id: 'tour-nav-roadmap', text: 'See your full journey from where you are to where you want to be.' }
    ];

    useEffect(() => {
        const updateRect = () => {
            const el = document.getElementById(steps[step].id);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If element not found (e.g. on wrong tab), just center it
                setTargetRect(null);
            }
        };

        // Small delay to allow rendering/transitions
        const timer = setTimeout(updateRect, 300);
        window.addEventListener('resize', updateRect);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [step]);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={handleNext}></div>
            
            {/* Highlight cutout (simulated with box-shadow on the tooltip for simplicity, or just a floating box) */}
            <div 
                className="absolute bg-dark-card border-2 border-brand-500 p-5 rounded-2xl shadow-[0_0_30px_rgba(0,230,118,0.3)] pointer-events-auto transition-all duration-500 ease-out w-72"
                style={{
                    top: targetRect ? Math.max(20, targetRect.bottom + 10) : '50%',
                    left: targetRect ? Math.max(20, Math.min(window.innerWidth - 300, targetRect.left)) : '50%',
                    transform: targetRect ? 'none' : 'translate(-50%, -50%)'
                }}
            >
                <div className="text-xs font-bold text-brand-500 mb-2 uppercase tracking-wider">Tip {step + 1} of {steps.length}</div>
                <p className="text-theme-text font-medium mb-4 leading-relaxed">{steps[step].text}</p>
                <div className="flex justify-between items-center">
                    <button onClick={onComplete} className="text-theme-muted text-sm hover:text-theme-text transition-colors">Skip tour</button>
                    <button onClick={handleNext} className="bg-brand-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover-scale">
                        {step === steps.length - 1 ? 'Done' : 'Got it →'}
                    </button>
                </div>
            </div>
        </div>
    );
};
