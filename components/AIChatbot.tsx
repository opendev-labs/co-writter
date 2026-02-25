
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconChevronDown, IconSend, IconPlus } from '../constants';
import * as ReactRouterDOM from 'react-router-dom';
import MorphicEye from './MorphicEye';
import {
    createNanoPiSession,
    sendNanoPiMessage,
    NANOPI_SYSTEM_PROMPT,
    NanoPiChatSession,
    checkNanoPiStatus,
} from '../services/nanoPiService';

const { useLocation } = ReactRouterDOM as any;

interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    isStreaming?: boolean;
}

// ---- Floating toggle button ----
export const NanoPiChatButton: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [online, setOnline] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        checkNanoPiStatus().then(setOnline);
    }, []);

    // Don't show on studio page
    if (location.pathname === '/ebook-studio') return null;

    return (
        <>
            {/* FAB button */}
            <button
                onClick={() => setOpen(v => !v)}
                title="Chat with NanoPi"
                className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
                {open ? (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.7" />
                        <path d="M2 12h3m14 0h3M12 2v3m0 14v3" strokeLinecap="round" />
                        <path d="M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M19.07 4.93l-2.12 2.12m-9.9 9.9-2.12 2.12" strokeLinecap="round" />
                    </svg>
                )}
                {/* Online dot */}
                {online !== null && (
                    <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-[#09090b] ${online ? 'bg-green-400' : 'bg-red-500'}`} />
                )}
            </button>

            {open && <NanoPiChatPanel onClose={() => setOpen(false)} />}
        </>
    );
};

// ---- Chat panel ----
const NanoPiChatPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [session, setSession] = useState<NanoPiChatSession>(() =>
        createNanoPiSession(NANOPI_SYSTEM_PROMPT)
    );
    const [online, setOnline] = useState<boolean | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        checkNanoPiStatus().then(setOnline);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [userInput]);

    const handleSend = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userInput.trim() || isProcessing) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userInput.trim() };
        const aiMsgId = (Date.now() + 1).toString();

        setMessages(prev => [...prev, userMsg, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);
        const currentInput = userInput.trim();
        setUserInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setIsProcessing(true);

        try {
            const { updatedSession } = await sendNanoPiMessage(session, currentInput, (fullText) => {
                setMessages(prev =>
                    prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m)
                );
            });
            setSession(updatedSession);
            setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m)
            );
        } catch (err) {
            setMessages(prev =>
                prev.map(m => m.id === aiMsgId
                    ? { ...m, text: '⚠️ NanoPi is waking up or offline. Try again in a moment.', isStreaming: false }
                    : m
                )
            );
        } finally {
            setIsProcessing(false);
        }
    }, [userInput, isProcessing, session]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[92vw] md:w-[400px] max-h-[75vh] bg-[#09090b]/97 backdrop-blur-2xl rounded-3xl border border-violet-500/20 shadow-[0_0_60px_rgba(139,92,246,0.2)] flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/5">

            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-r from-violet-900/20 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.7" />
                            <path d="M2 12h3m14 0h3M12 2v3m0 14v3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">NanoPi</h2>
                        <p className="text-[10px] text-violet-400 font-mono">
                            {online === null ? 'Checking...' : online ? '● Online' : '○ Waking up...'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                    <IconChevronDown className="w-5 h-5" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-0 bg-[#09090b]">
                {messages.length === 0 && (
                    <div className="text-center px-6 pt-10 pb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                                <path d="M2 12h3m14 0h3M12 2v3m0 14v3" strokeLinecap="round" />
                                <path d="M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M19.07 4.93l-2.12 2.12m-9.9 9.9-2.12 2.12" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="text-neutral-400 text-sm font-medium mb-1">NanoPi is ready</p>
                        <p className="text-neutral-600 text-xs">Ask me to write, plan, or improve your book.</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-5">
                            {['Help me start a book', 'Write Chapter 1', 'Create an outline', 'Improve my prose'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setUserInput(s)}
                                    className="px-3 py-1.5 rounded-full text-xs border border-violet-500/20 text-violet-300 hover:bg-violet-500/10 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className="animate-fade-in border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <div className="px-5 py-5 flex gap-3 items-start">
                            {msg.role === 'ai' && (
                                <div className="flex-shrink-0 w-7 h-7 mt-0.5 rounded-lg bg-gradient-to-br from-violet-600/40 to-indigo-600/30 border border-violet-500/20 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                                        <path d="M2 12h3m14 0h3M12 2v3m0 14v3" strokeLinecap="round" />
                                    </svg>
                                </div>
                            )}
                            <div className={`flex-1 space-y-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.role === 'ai' && (
                                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">NanoPi</span>
                                )}
                                <div className={`text-sm leading-7 font-sans whitespace-pre-wrap ${msg.role === 'user' ? 'text-neutral-200 font-medium' : 'text-neutral-300'}`}>
                                    {msg.text}
                                    {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-violet-400 animate-pulse align-middle rounded-sm" />}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
                <div className="w-full bg-[#1e1e1e] border border-white/10 rounded-[28px] p-2 pl-4 flex items-end gap-2 shadow-lg transition-all focus-within:border-violet-500/30">
                    <div className="flex-grow py-2">
                        <textarea
                            ref={textareaRef}
                            className="w-full bg-transparent text-white text-sm placeholder-neutral-500 resize-none focus:outline-none max-h-32 custom-scrollbar"
                            placeholder="Ask NanoPi anything about your book..."
                            rows={1}
                            value={userInput}
                            onKeyDown={handleKeyDown}
                            onChange={e => setUserInput(e.target.value)}
                            disabled={isProcessing}
                            style={{ minHeight: '24px' }}
                        />
                    </div>
                    {userInput.trim() ? (
                        <button
                            onClick={(e) => handleSend(e)}
                            disabled={isProcessing}
                            className="w-9 h-9 mb-0.5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                        >
                            <IconSend className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="w-9 h-9 mb-0.5 flex-shrink-0" />
                    )}
                </div>
                <p className="text-center text-[9px] text-neutral-600 mt-2">
                    Powered by NanoPi · opendev-labs-nanopi.hf.space
                </p>
            </div>
        </div>
    );
};

export default NanoPiChatButton;
