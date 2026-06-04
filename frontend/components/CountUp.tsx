import React, { useState, useEffect } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ end, duration = 1000, prefix = '', suffix = '', decimals = 0 }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setValue(easeProgress * end);

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            } else {
                setValue(end);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return <span>{prefix}{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};
