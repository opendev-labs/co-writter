
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
    IconChevronDown, IconSend, IconPlus, IconMic
} from '../../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { GenerateContentResponse } from '@google/genai';
import MorphicEye from './MorphicEye';

const { useLocation } = ReactRouterDOM as any;

interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    isStreaming?: boolean;
}

const AIChatbot: React.FC = () => {
  const { geminiChat, initializeChat, isChatbotOpen, toggleChatbot } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (isChatbotOpen && !geminiChat) {
      initializeChat();
    }
  }, [isChatbotOpen, geminiChat, initializeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatbotOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [userInput]);

  // Hide global chatbot on Studio page to avoid UI overlap with Studio Agent
  if (location.pathname === '/ebook-studio') {
      return null;
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || !geminiChat || isAiProcessing) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = userInput;
    setUserInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto'; // Reset height
    setIsAiProcessing(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);

    try {
        const responseStream = await geminiChat.sendMessageStream({ message: currentInput });
        
        let fullText = '';
        for await (const chunk of responseStream) {
             const chunkText = (chunk as GenerateContentResponse).text;
             if (chunkText) {
                 fullText += chunkText;
                 setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
             }
        }
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));

    } catch (error) {
        console.error("Chat error", error);
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Connection error. Please try again.", isStreaming: false } : m));
    } finally {
        setIsAiProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
      }
  };

  if (!isChatbotOpen) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-[60] flex flex-col items-end">
        {/* === GLOBAL OVERLAY WINDOW === */}
        <div className="w-[90vw] md:w-[400px] h-[500px] md:h-[600px] max-h-[80vh] bg-[#09090b]/95 backdrop-blur-2xl rounded-t-3xl border-t border-x border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/10">
             <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                    <MorphicEye className="w-8 h-8 rounded-lg border border-white/10" />
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">QUICK ASSIST</h2>
                    </div>
                </div>
                <button 
                    onClick={toggleChatbot}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                    <IconChevronDown className="w-5 h-5"/>
                </button>
            </header>
            
             <div className="flex-grow overflow-y-auto custom-scrollbar p-0 bg-[#09090b]">
                {messages.length === 0 && (
                    <div className="text-center text-neutral-500 text-sm mt-10 px-6">
                        <p>How can I help you navigate or create today?</p>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className="animate-fade-in border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                         <div className="px-5 py-6 flex gap-4 items-start">
                            {msg.role === 'ai' && (
                                <MorphicEye className="w-8 h-8 rounded-lg flex-shrink-0 mt-1" isActive={false} />
                            )}
                            <div className={`flex-1 space-y-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.role === 'ai' && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white uppercase tracking-wide">Co-Author</span>
                                    </div>
                                )}
                                <div className={`text-sm leading-7 font-sans whitespace-pre-wrap ${msg.role === 'user' ? 'text-neutral-200 font-medium' : 'text-neutral-300'}`}>
                                    {msg.text}
                                    {msg.isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-google-blue animate-pulse align-middle"></span>}
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
             </div>

             {/* Google Style Input Area */}
             <div className="p-4 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent">
                <div className="w-full bg-[#1e1e1e] border border-white/10 rounded-[28px] p-2 pl-4 flex items-end gap-2 shadow-lg transition-all focus-within:bg-[#252525] focus-within:border-white/20">
                    
                    {/* Attachment Icon (Visual Only) */}
                    <button className="w-8 h-8 mb-1 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
                        <IconPlus className="w-4 h-4" />
                    </button>

                    <div className="flex-grow py-2">
                        <textarea 
                            ref={textareaRef}
                            className="w-full bg-transparent text-white text-sm placeholder-neutral-500 resize-none focus:outline-none max-h-32 custom-scrollbar"
                            placeholder="Ask anything..."
                            rows={1}
                            value={userInput}
                            onKeyDown={handleKeyDown}
                            onChange={e => setUserInput(e.target.value)}
                            disabled={isAiProcessing}
                            style={{ minHeight: '24px' }}
                        />
                    </div>

                    {userInput.trim() ? (
                        <button 
                            onClick={(e) => handleSendMessage(e)}
                            disabled={isAiProcessing} 
                            className="w-10 h-10 mb-0.5 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex-shrink-0"
                        >
                            <IconSend className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="w-10 h-10 mb-0.5 rounded-full flex items-center justify-center text-neutral-500 flex-shrink-0">
                            <IconMic className="w-5 h-5" />
                        </div>
                    )}
                </div>
                <div className="text-center mt-2">
                     <p className="text-[9px] text-neutral-600">AI can make mistakes. Check important info.</p>
                </div>
             </div>
        </div>
    </div>
  );
};

export default AIChatbot;
