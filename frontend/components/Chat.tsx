import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SendIcon, DatabaseIcon, CheckCircleIcon } from './Icons';
import ReactMarkdown from 'react-markdown';
import { ChatSkeleton } from './Skeletons';

interface ChatProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    isLoadingHistory?: boolean;
}

export const Chat: React.FC<ChatProps> = ({ messages, onSendMessage, isLoading, isLoadingHistory }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const renderConfidenceBadge = (confidence?: string) => {
        if (!confidence) return null;
        let color = 'bg-dark-bg text-theme-muted border-dark-border';
        let dot = 'bg-gray-500';
        if (confidence === 'HIGH') { color = 'bg-brand-500/10 text-brand-500 border-brand-500/30'; dot = 'bg-brand-500'; }
        if (confidence === 'ESTIMATED') { color = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'; dot = 'bg-yellow-500'; }
        if (confidence === 'HYPOTHETICAL') { color = 'bg-blue-500/10 text-blue-500 border-blue-500/30'; dot = 'bg-blue-500'; }

        return (
            <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wider ${color}`} title="Agent Confidence Level">
                <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
                {confidence}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg relative pb-16 md:pb-0">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 border-b border-dark-border bg-dark-bg/90 backdrop-blur-md flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_rgba(0,230,118,0.8)]"></div>
                    <h1 className="font-extrabold text-theme-text text-lg tracking-tight">GroundUp Agent</h1>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 pt-24 space-y-6">
                {isLoadingHistory ? (
                    <ChatSkeleton />
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <p className="text-theme-text font-medium text-lg max-w-sm mb-6">
                            Ask me to run a "what if" scenario, help plan your debt payoff, or log a new transaction.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <span className="text-sm bg-dark-card border border-dark-border px-4 py-2 rounded-full text-theme-text font-medium shadow-sm cursor-pointer hover:bg-dark-border transition-colors" onClick={() => setInput("What if I get a $500 raise?")}>"What if I get a $500 raise?"</span>
                            <span className="text-sm bg-dark-card border border-dark-border px-4 py-2 rounded-full text-theme-text font-medium shadow-sm cursor-pointer hover:bg-dark-border transition-colors" onClick={() => setInput("Can I afford a $1200 apartment?")}>"Can I afford a $1200 apartment?"</span>
                            <span className="text-sm bg-dark-card border border-dark-border px-4 py-2 rounded-full text-theme-text font-medium shadow-sm cursor-pointer hover:bg-dark-border transition-colors" onClick={() => setInput("Audit my subscriptions")}>"Audit my subscriptions"</span>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.isRecap && (
                                <div className="w-full flex justify-center mb-4">
                                    <span className="bg-brand-500/20 text-brand-500 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/30">Weekly Recap Generated</span>
                                </div>
                            )}

                            {msg.toolCalls && msg.toolCalls.length > 0 && (
                                <div className="flex flex-col gap-1.5 mb-2 ml-2">
                                    {msg.toolCalls.map((tool, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-black bg-brand-500 px-3 py-1.5 rounded-md shadow-sm">
                                            <DatabaseIcon className="w-3.5 h-3.5" />
                                            {tool.name}
                                            <CheckCircleIcon className="w-3.5 h-3.5 ml-1" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.text && (
                                <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-md ${
                                    msg.role === 'user' 
                                        ? 'bg-brand-500 text-black font-medium rounded-br-sm' 
                                        : 'bg-dark-card text-theme-text rounded-bl-sm border border-dark-border'
                                }`}>
                                    {msg.role === 'model' ? (
                                        <>
                                            <div className="prose prose-invert prose-base max-w-none prose-p:leading-relaxed prose-a:text-brand-500 prose-strong:text-theme-text">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                            {renderConfidenceBadge(msg.confidence)}
                                        </>
                                    ) : (
                                        <p className="whitespace-pre-wrap text-base">{msg.text}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex items-start">
                        <div className="bg-dark-card border border-dark-border rounded-2xl rounded-bl-sm px-5 py-5 flex items-center gap-2 shadow-md">
                            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-dark-bg border-t border-dark-border">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message GroundUp..."
                        disabled={isLoading}
                        className="w-full bg-dark-card border-2 border-dark-border text-theme-text font-medium rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-base shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2.5 bg-brand-500 text-black rounded-lg disabled:opacity-50 hover-scale transition-colors flex items-center justify-center shadow-sm"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
