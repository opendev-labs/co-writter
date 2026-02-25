
import React, { useEffect, useRef, useState } from 'react';
import { IconX, IconBrain, IconActivity, IconSparkles, IconFeather } from '../constants';
import MorphicEye from './MorphicEye';

interface CinematicWriterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isStreaming: boolean;
  chapterTitle: string;
}

const CinematicWriterOverlay: React.FC<CinematicWriterOverlayProps> = ({ 
  isOpen, 
  onClose, 
  content, 
  isStreaming,
  chapterTitle 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayedContent, setDisplayedContent] = useState('');
  const [metrics, setMetrics] = useState({ tps: 0, stability: 100, sync: 0 });
  const [lastImage, setLastImage] = useState<string | null>(null);
  const [isDecodingImage, setIsDecodingImage] = useState(false);

  // Auto-scroll to bottom with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
        const scroll = scrollRef.current;
        // Only auto-scroll if near bottom to allow reading up
        const isNearBottom = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 300;
        if (isNearBottom) {
            scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [displayedContent]);

  // Sync Content & Metrics
  useEffect(() => {
    if (!isOpen) return;
    
    setDisplayedContent(content);

    // Detect new images
    const imgMatch = content.match(/!\[.*?\]\((.*?)\)/g);
    if (imgMatch) {
        const lastImgTag = imgMatch[imgMatch.length - 1];
        const urlMatch = lastImgTag.match(/\((.*?)\)/);
        if (urlMatch && urlMatch[1] !== lastImage) {
            setIsDecodingImage(true);
            setTimeout(() => {
                setLastImage(urlMatch[1]);
                setIsDecodingImage(false);
            }, 2000); 
        }
    }

    // Simulate "Thinking" Metrics
    if (isStreaming) {
        const interval = setInterval(() => {
            setMetrics({
                tps: Math.floor(Math.random() * 40) + 90, // Varied speed
                stability: 98 + Math.random() * 2,
                sync: Math.min(100, metrics.sync + 2)
            });
        }, 800);
        return () => clearInterval(interval);
    } else {
        setMetrics(m => ({ ...m, sync: 100, tps: 0 }));
    }

  }, [content, isOpen, isStreaming]);

  if (!isOpen) return null;

  // Render Content with "Materialize" Effect
  const renderContent = () => {
      const parts = displayedContent.split(/(!\[.*?\]\(.*?\))/g);
      return parts.map((part, idx) => {
          if (part.match(/!\[.*?\]\(.*?\)/)) {
              const src = part.match(/\((.*?)\)/)?.[1];
              const alt = part.match(/!\[(.*?)\]/)?.[1] || "Visual Asset";
              if (!src) return null;
              
              const isCurrent = src === lastImage && isDecodingImage;

              return (
                  <div key={idx} className="my-12 w-full flex flex-col items-center">
                      <div className={`
                          relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden transition-all duration-1000
                          ${isCurrent ? 'scale-95 opacity-80 blur-sm' : 'scale-100 opacity-100 blur-0 shadow-2xl shadow-indigo-500/10'}
                      `}>
                          {isCurrent && (
                              <div className="absolute inset-0 z-10 bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                                  <div className="flex flex-col items-center gap-3">
                                      <IconSparkles className="w-6 h-6 text-white animate-spin-slow" />
                                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">Materializing Visual...</span>
                                  </div>
                              </div>
                          )}
                          <img 
                            src={src} 
                            alt={alt}
                            className="w-full h-full object-cover animate-fade-in" 
                          />
                          {/* Cinematic Letterbox Bars */}
                          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                      </div>
                      <span className="mt-4 text-[10px] uppercase tracking-widest text-neutral-600 font-medium">
                          Fig. {idx + 1} — {alt}
                      </span>
                  </div>
              );
          }
          
          // Typography Processing
          return (
            <div key={idx} className="animate-slide-up">
                {part.split('\n').map((line, i) => {
                    if(!line.trim()) return <div key={i} className="h-6"></div>;
                    
                    if (line.startsWith('# ')) 
                        return <h1 key={i} className="text-4xl md:text-5xl font-serif text-white font-medium mb-8 mt-12 leading-tight tracking-tight">{line.replace('# ', '')}</h1>;
                    
                    if (line.startsWith('## ')) 
                        return <h2 key={i} className="text-2xl md:text-3xl font-serif text-white/90 mb-6 mt-10 leading-snug">{line.replace('## ', '')}</h2>;
                    
                    // Render Paragraphs
                    return (
                        <p key={i} className="mb-6 text-lg md:text-xl leading-relaxed text-neutral-300 font-serif font-light tracking-wide mix-blend-screen">
                            {line.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
                                // Bold parsing hack for simplicity in this view
                                return p1; // We just return text, React dangerouslySetInnerHtml would be needed for true parsing or a dedicated parser comp
                            })}
                        </p>
                    );
                })}
            </div>
          );
      });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col font-sans">
        
        {/* --- AMBIENT ATMOSPHERE --- */}
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* The "Aurora" - Reacts to streaming state */}
            <div className={`
                absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] transition-all duration-[2000ms]
                ${isStreaming ? 'opacity-60 scale-110 translate-y-10' : 'opacity-30 scale-100'}
            `}></div>
            <div className={`
                absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-900/10 rounded-full blur-[150px] transition-all duration-[3000ms]
                ${isStreaming ? 'opacity-50 scale-105 -translate-y-10' : 'opacity-20 scale-100'}
            `}></div>
            
            {/* Grain Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>

        {/* --- TOP BAR --- */}
        <header className="relative z-20 h-20 px-8 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div className={`absolute -inset-2 bg-white/5 rounded-full blur-md transition-opacity duration-500 ${isStreaming ? 'opacity-100' : 'opacity-0'}`}></div>
                    <MorphicEye className="w-10 h-10 border border-white/10 bg-black/50 shadow-2xl" isActive={isStreaming} />
                </div>
                <div>
                    <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">Co-Author</h2>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`}></span>
                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
                            {isStreaming ? 'Neural Engine Active' : 'Standby'}
                        </p>
                    </div>
                </div>
            </div>

            <button 
                onClick={onClose}
                className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
                <span className="text-xs font-bold tracking-widest text-neutral-400 group-hover:text-white transition-colors">EXIT STUDIO</span>
                <IconX className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </button>
        </header>

        {/* --- MAIN CANVAS --- */}
        <main className="relative z-10 flex-1 overflow-hidden flex justify-center">
            <div 
                ref={scrollRef}
                className="w-full max-w-4xl h-full overflow-y-auto custom-scrollbar px-6 md:px-12 py-12 scroll-smooth"
            >
                {/* Context Tag */}
                <div className="flex justify-center mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                            Drafting: {chapterTitle}
                        </span>
                    </div>
                </div>

                {/* The Content */}
                <article className="prose prose-invert max-w-none">
                    {renderContent()}
                    
                    {/* The "Living" Cursor */}
                    {isStreaming && (
                        <div className="inline-block w-1 h-6 ml-1 bg-gradient-to-t from-transparent via-white to-transparent opacity-80 animate-pulse align-middle shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                    )}
                </article>

                {/* Bottom Spacer */}
                <div className="h-32"></div>
            </div>
        </main>

        {/* --- FLOATING HUD --- */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <div className="flex items-center gap-6 px-8 py-3 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-transform duration-500 hover:scale-105">
                
                {/* Metric: Speed */}
                <div className="flex items-center gap-3 border-r border-white/5 pr-6">
                    <IconFeather className="w-4 h-4 text-neutral-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tabular-nums leading-none">{metrics.tps}</span>
                        <span className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold">Tokens/s</span>
                    </div>
                </div>

                {/* Metric: Stability */}
                <div className="flex items-center gap-3 border-r border-white/5 pr-6">
                    <IconBrain className="w-4 h-4 text-neutral-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tabular-nums leading-none">{metrics.stability.toFixed(0)}%</span>
                        <span className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold">Coherence</span>
                    </div>
                </div>

                {/* Metric: Sync */}
                <div className="flex items-center gap-3">
                    <IconActivity className={`w-4 h-4 transition-colors ${isStreaming ? 'text-green-500' : 'text-neutral-500'}`} />
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-300 ease-out shadow-[0_0_10px_white]" 
                            style={{ width: `${metrics.sync}%` }}
                        ></div>
                    </div>
                </div>

            </div>
        </div>

    </div>
  );
};

export default CinematicWriterOverlay;
