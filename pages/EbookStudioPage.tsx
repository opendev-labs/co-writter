
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { EBook, EBookPage } from '../types';
import * as ReactRouterDOM from 'react-router-dom';
import {
    IconBook, IconSparkles, IconSend, IconPlus, IconArrowLeft,
    IconRocket, IconX, IconMic, IconStop, IconImage, IconCheck, IconBrain, 
    IconFeather
} from '../constants';
import {
    createStudioSession, generateBookCover, transcribeAudio
} from '../services/geminiService';
import { Chat, Part } from '@google/genai';
import MorphicEye from '../components/MorphicEye';
import NovelEditor from '../components/NovelEditor';
import CinematicWriterOverlay from '../components/CinematicWriterOverlay';

const { useNavigate, useLocation } = ReactRouterDOM as any;

interface ChatMessage {
    id: string;
    role: 'user' | 'ai' | 'system';
    text: string;
    isStreaming?: boolean;
    isToolUse?: boolean;
    attachments?: string[];
}

const EbookStudioPage: React.FC = () => {
  const { currentUser, addCreatedBook } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPrompt = location.state?.initialPrompt || '';

  // Layout State
  const [leftTab, setLeftTab] = useState<'chat' | 'outline'>('chat');
  const [isCinematicMode, setIsCinematicMode] = useState(false);

  // Project State
  const [pages, setPages] = useState<EBookPage[]>([
    { id: '1', title: 'Chapter 1: The Beginning', content: '', pageNumber: 1 }
  ]);
  const [activePageId, setActivePageId] = useState<string>('1');
  const activePage = useMemo(() => pages.find(p => p.id === activePageId) || pages[0], [pages, activePageId]);

  // AI & Audio State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Auto-Pilot State
  const [autoPilotMode, setAutoPilotMode] = useState<'idle' | 'planning' | 'writing_sequence'>('idle');
  const [writeQueue, setWriteQueue] = useState<string[]>([]);

  // Multimodal State
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
        const initialContext = `You are the Co-Author engine (v3.5) for co-writter.
        Current User: ${currentUser?.name || 'Author'}.
        Project Context: Active Chapter "${activePage.title}".
        Goal: Writing a world-class book with deep reasoning.`;

        const session = createStudioSession(initialContext);
        if (session) {
            chatSessionRef.current = session;
            setMessages([{ id: 'sys-init', role: 'ai', text: "Engine Online. Ready to create." }]);
            if (initialPrompt) {
                setTimeout(() => handleSendMessage(undefined, initialPrompt), 500);
            }
        }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, leftTab]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  useEffect(() => {
      if (!isBusy) {
          if (autoPilotMode === 'planning') {
              if (pages.length > 1) {
                  const incompleteIds = pages.map(p => p.id);
                  setWriteQueue(incompleteIds);
                  setAutoPilotMode('writing_sequence');
                  triggerNextWrite(incompleteIds);
              } else {
                  setAutoPilotMode('idle');
              }
          } else if (autoPilotMode === 'writing_sequence') {
              if (writeQueue.length > 0) {
                  triggerNextWrite(writeQueue);
              } else {
                  setAutoPilotMode('idle');
                  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: "Auto-Pilot Complete. Book Finalized." }]);
              }
          }
      }
  }, [isBusy, autoPilotMode, pages]);

  const triggerNextWrite = (currentQueue: string[]) => {
      if (currentQueue.length === 0) return;
      const nextId = currentQueue[0];
      const remaining = currentQueue.slice(1);
      setWriteQueue(remaining);
      setActivePageId(nextId);

      const targetPage = pages.find(p => p.id === nextId);
      if (targetPage) {
          setTimeout(() => {
              const prompt = `Lead Writer: Chapter ${targetPage.pageNumber}: "${targetPage.title}". Write immersive ~1000 words.`;
              handleSendMessage(undefined, prompt);
          }, 1000);
      }
  };

  const fileToPart = async (file: File): Promise<Part> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = (reader.result as string).split(',')[1];
              resolve({ inlineData: { data: base64String, mimeType: file.type } });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles = Array.from(e.target.files);
          setAttachments(prev => [...prev, ...newFiles]);
          // Fix: Explicitly cast file to Blob to avoid 'unknown' or 'File' typing issues in some environments
          const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file as Blob));
          setAttachmentPreviews(prev => [...prev, ...newPreviews]);
      }
  };

  const removeAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
      setAttachmentPreviews((prev: string[]) => {
          // Fix: Ensure we are revoking a valid string reference
          if (prev[index]) {
              URL.revokeObjectURL(prev[index]);
          }
          return prev.filter((_, i) => i !== index);
      });
  };

  const executeStudioTool = async (name: string, args: any): Promise<string> => {
      try {
          if (name === 'write_content') {
              setPages(prev => prev.map(p => p.id === activePageId ? { ...p, content: args.content } : p));
              return "Content saved to editor.";
          }
          if (name === 'generate_image') {
              setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `Visualizing: ${args.prompt}...` }]);
              const result = await generateBookCover(args.prompt, "Cinematic", activePage.title, currentUser?.name);
              if ('imageBytes' in result) {
                  const md = `\n\n![${args.prompt}](data:image/jpeg;base64,${result.imageBytes})\n\n`;
                  setPages(prev => prev.map(p => p.id === activePageId ? { ...p, content: p.content + md } : p));
                  return "Visual asset materialized.";
              }
              return "Visualization failed.";
          }
          if (name === 'propose_blueprint') {
              const newPages: EBookPage[] = args.outline.map((chapter: any, idx: number) => ({
                  id: Date.now().toString() + idx,
                  title: chapter.title,
                  content: `> **Objective**: ${chapter.summary}\n\n`,
                  pageNumber: idx + 1
              }));
              setPages(newPages);
              if (newPages.length > 0) setActivePageId(newPages[0].id);
              return `Blueprint synchronized. Title: "${args.title}".`;
          }
          return "Instruction acknowledged.";
      } catch (error: any) {
          return `Error: ${error.message}`;
      }
  };

  const handleSendMessage = async (e?: React.FormEvent, overrideInput?: string) => {
      const text = overrideInput || input;
      if(!text.trim() && attachments.length === 0) return;

      const currentAttachments = [...attachments];
      const currentPreviews = [...attachmentPreviews];

      setInput('');
      setAttachments([]);
      setAttachmentPreviews([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';

      if (!autoPilotMode || autoPilotMode === 'idle') {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, attachments: currentPreviews }]);
      }
      setIsBusy(true);

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '', isStreaming: true }]);

      try {
          if (!chatSessionRef.current) throw new Error("No link");
          const parts: (string | Part)[] = [];
          if (text.trim()) parts.push({ text });
          for (const file of currentAttachments) {
              parts.push(await fileToPart(file));
          }

          const result = await chatSessionRef.current.sendMessageStream({ message: parts as any });
          let fullText = "";
          let finalFunctionCalls: any[] | undefined = undefined;

          for await (const chunk of result) {
              if (chunk.text) {
                  fullText += chunk.text;
                  setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
              }
              if (chunk?.functionCalls) finalFunctionCalls = chunk.functionCalls;
          }

          if (finalFunctionCalls && finalFunctionCalls.length > 0) {
              setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isToolUse: true, text: m.text + "\n\n*Synchronizing Editor...*" } : m));
              const responses: Part[] = [];
              for (const call of finalFunctionCalls) {
                  responses.push({ functionResponse: { name: call.name, response: { result: await executeStudioTool(call.name, call.args) } } });
              }
              const toolResult = await chatSessionRef.current.sendMessageStream({ message: responses });
              let toolOutputText = "";
              for await (const chunk of toolResult) {
                  if (chunk.text) {
                      toolOutputText += chunk.text;
                      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText + (fullText ? "\n\n" : "") + toolOutputText, isToolUse: false } : m));
                  }
              }
          }
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m));
      } catch (e) {
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Interface interrupted. Please retry.", isStreaming: false } : m));
      } finally {
          setIsBusy(false);
      }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setIsBusy(true);
            try {
                const text = await transcribeAudio(base64, 'audio/webm');
                if (text) setInput(prev => prev + (prev ? " " : "") + text);
            } catch (err) {}
            setIsBusy(false);
        };
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsListening(true);
    } catch (err) { alert("Mic access denied."); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isListening) { mediaRecorderRef.current.stop(); setIsListening(false); } };

  const handleAutoWrite = () => {
      setIsCinematicMode(true);
      const needsOutline = pages.length <= 1 && pages[0].content.length < 200;
      if (needsOutline) {
          setAutoPilotMode('planning');
          handleSendMessage(undefined, `Architect: Proposed outline for "${pages[0].title}". Use propose_blueprint.`);
      } else {
          const incompleteIds = pages.map(p => p.id);
          setWriteQueue(incompleteIds);
          setAutoPilotMode('writing_sequence');
          triggerNextWrite(incompleteIds);
      }
  };

  const handleExport = () => {
      addCreatedBook({
          id: `gen-${Date.now()}`,
          title: pages[0].title || "Untitled",
          author: currentUser?.name || 'Author',
          description: 'AI Synthesized Book',
          price: 0,
          coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
          genre: 'Draft',
          sellerId: currentUser?.id || 'guest',
          publicationDate: new Date().toISOString().split('T')[0],
          pages: pages
      });
      navigate('/dashboard');
  };

  const lastAiMessage = messages.slice().reverse().find(m => m.role === 'ai');

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans">
        
        <CinematicWriterOverlay 
            isOpen={isCinematicMode} 
            onClose={() => { setIsCinematicMode(false); setAutoPilotMode('idle'); setWriteQueue([]); }}
            content={lastAiMessage ? lastAiMessage.text : "Neural Link Established..."}
            isStreaming={isBusy}
            chapterTitle={activePage.title}
        />

        <header className="h-14 border-b border-white/10 bg-[#050505] flex items-center justify-between px-4 z-50 shrink-0">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-neutral-400 hover:text-white uppercase text-[10px] font-bold tracking-widest transition-colors">
                <IconArrowLeft className="w-4 h-4" /> Exit Studio
            </button>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleAutoWrite}
                    disabled={isBusy || autoPilotMode !== 'idle'}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase hover:bg-indigo-500/20 transition-colors disabled:opacity-50 text-indigo-300"
                >
                    {isBusy ? <IconSparkles className="w-3 h-3 animate-spin" /> : <IconBrain className="w-3 h-3" />}
                    {autoPilotMode !== 'idle' ? 'Processing...' : 'Neural Auto-Pilot'}
                </button>
                <div className="h-4 w-px bg-white/10 mx-1"></div>
                <button onClick={handleExport} className="bg-white text-black px-6 py-1.5 rounded-full text-[10px] font-bold uppercase hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                    Sync Changes
                </button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
            <aside className="hidden md:flex w-[360px] bg-[#09090b] border-r border-white/10 flex-col z-20 shadow-2xl">
                <div className="flex border-b border-white/10">
                    <button onClick={() => setLeftTab('chat')} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${leftTab === 'chat' ? 'text-white bg-white/5 border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}>Co-Author</button>
                    <button onClick={() => setLeftTab('outline')} className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${leftTab === 'outline' ? 'text-white bg-white/5 border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}>Outline</button>
                </div>

                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {leftTab === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                {messages.map((msg, idx) => (
                                    <div key={msg.id} className="py-6 px-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-3 mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {msg.role === 'user' ? (
                                                <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10">
                                                    <span className="text-[10px] font-bold text-neutral-400">U</span>
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                    <IconSparkles className="w-3 h-3 text-indigo-400" />
                                                </div>
                                            )}
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-neutral-500' : 'text-indigo-400'}`}>
                                                {msg.role === 'user' ? 'Human' : 'Neural Core'}
                                            </span>
                                        </div>
                                        <div className={`pl-8 text-sm leading-7 font-medium whitespace-pre-wrap font-sans ${msg.role === 'user' ? 'text-white' : 'text-neutral-300'}`}>
                                            {msg.attachments?.map((src, i) => <img key={i} src={src} className="h-20 w-auto rounded-lg mb-2" />)}
                                            {msg.text}
                                            {msg.isToolUse && <div className="mt-2 text-[9px] text-green-400 uppercase tracking-widest flex items-center gap-1"><IconCheck className="w-2 h-2" /> Sync Active</div>}
                                            {msg.role === 'ai' && msg.isStreaming && idx === messages.length - 1 && <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse"></span>}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-[#09090b] border-t border-white/10">
                                {attachmentPreviews.length > 0 && (
                                    <div className="flex gap-2 mb-3 px-1 overflow-x-auto">
                                        {attachmentPreviews.map((src, idx) => (
                                            <div key={idx} className="relative group flex-shrink-0">
                                                <img src={src} className="h-14 w-14 object-cover rounded-lg border border-white/10 shadow-md" />
                                                <button onClick={() => removeAttachment(idx)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black rounded-full text-white border border-white/20 hover:bg-red-500 transition-colors"><IconX className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className={`bg-[#151515] border rounded-[28px] p-2 flex items-end gap-2 shadow-lg transition-colors ${isBusy ? 'border-indigo-500/30' : 'border-white/10 focus-within:border-white/20'}`}>
                                    <button onClick={() => fileInputRef.current?.click()} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors mb-0.5"><IconPlus className="w-4 h-4" /></button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,application/pdf" multiple />
                                    <button
                                        onMouseDown={startRecording} onMouseUp={stopRecording}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 mb-0.5 ${isListening ? 'bg-red-500 text-white scale-110' : 'bg-white/5 text-neutral-400 hover:text-white'}`}
                                    >
                                        {isListening ? <IconStop className="w-4 h-4" /> : <IconMic className="w-4 h-4" />}
                                    </button>
                                    <textarea
                                        ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
                                        placeholder={isListening ? "Listening..." : "Ask Co-Author..."}
                                        className="flex-1 bg-transparent border-none outline-none text-white text-sm py-2.5 max-h-32 resize-none font-medium"
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                        disabled={isBusy}
                                    />
                                    <button onClick={() => handleSendMessage()} className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mb-0.5 disabled:opacity-50">
                                        {isBusy ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <IconSend className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2 px-2 text-[9px] text-neutral-600 font-mono">
                                    <span>GEMINI 3 FLASH CORE</span>
                                    <span>{activePage.content.length} CHARS</span>
                                </div>
                            </div>
                        </>
                    )}

                    {leftTab === 'outline' && (
                         <div className="p-4 space-y-2 overflow-y-auto flex-1">
                             {pages.map((p, idx) => (
                                 <button
                                    key={p.id} onClick={() => setActivePageId(p.id)}
                                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all group ${activePageId === p.id ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'border-transparent text-neutral-500 hover:bg-white/5'}`}
                                 >
                                     <div className="flex items-center justify-between mb-1">
                                         <span className="text-[9px] uppercase font-bold opacity-50 tracking-wider">Chapter {idx + 1}</span>
                                         {activePageId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                     </div>
                                     <span className="font-bold truncate block">{p.title}</span>
                                 </button>
                             ))}
                             <button
                                onClick={() => {
                                    const newId = Date.now().toString();
                                    setPages([...pages, { id: newId, title: 'New Chapter', content: '', pageNumber: pages.length + 1 }]);
                                    setActivePageId(newId);
                                }}
                                className="w-full py-4 border border-dashed border-white/10 text-neutral-500 text-xs font-bold uppercase rounded-xl hover:border-white/30 hover:text-white mt-4 flex items-center justify-center gap-2 transition-all"
                             >
                                 <IconPlus className="w-3 h-3" /> Append Node
                             </button>
                         </div>
                    )}
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative bg-[#000000]">
                <div className="h-10 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                     <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">{activePage.title}</span>
                     <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                         <span className="bg-white/5 px-2 py-0.5 rounded">MODALITY: TEXT/IMAGE</span>
                         <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`}></div>
                             <span>{isBusy ? 'SYNCING' : 'STABLE'}</span>
                         </div>
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                    <NovelEditor
                        title={activePage.title}
                        onTitleChange={(t) => setPages(prev => prev.map(p => p.id === activePageId ? {...p, title: t} : p))}
                        content={activePage.content}
                        onContentChange={(c) => setPages(prev => prev.map(p => p.id === activePageId ? {...p, content: c} : p))}
                        onTriggerAI={(p) => handleSendMessage(undefined, `Write content: ${p}`)}
                        onTriggerImageGen={(p) => handleSendMessage(undefined, `Generate image: ${p}`)}
                    />
                </div>
            </main>
        </div>
    </div>
  );
};

export default EbookStudioPage;
