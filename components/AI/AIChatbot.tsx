import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
    IconChevronDown, IconSend
} from '../../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { GenerateContentResponse } from '@google/genai';
import MorphicEye from '../MorphicEye';

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
  const location = useLocation();

  useEffect(() => {
    if (isChatbotOpen && !geminiChat) {
      initializeChat();
    }
  }, [isChatbotOpen, geminiChat, initializeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatbotOpen]);

  // Hide global chatbot on Studio page to avoid UI overlap with Studio Agent
  if (location.pathname === '/ebook-studio') {
      return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !geminiChat || isAiProcessing) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = userInput;
    setUserInput('');
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

  if (!isChatbotOpen) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 z-[60] flex flex-col items-end">
        {/* === GLOBAL OVERLAY WINDOW === */}
        <div className="w-[90vw] md:w-[400px] h-[500px] md:h-[600px] max-h-[80vh] bg-[#09090b]/95 backdrop-blur-2xl rounded-t-3xl border-t border-x border-white/10 shadow-2xl flex flex-col overflow-hidden animate-slide-up ring-1 ring-white/10">
             <header className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3">
                    <MorphicEye className="w-10 h-10 rounded-lg border border-white/20 bg-[#222] shadow-sm" />
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
                                <MorphicEye className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 border border-white/20 bg-[#222]" isActive={false} />
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

             <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                <input 
                    className="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-google-blue/50 transition-colors placeholder-neutral-600"
                    placeholder="Ask anything..."
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    disabled={isAiProcessing}
                />
                <button type="submit" disabled={!userInput.trim() || isAiProcessing} className="p-3 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                    <IconSend className="w-4 h-4" />
                </button>
             </form>
        </div>
    </div>
  );
};

export default AIChatbot;