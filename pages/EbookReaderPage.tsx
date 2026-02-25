
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { EBook, User, Seller, UserType } from '../types';
import { 
    IconBook, IconX, IconChevronLeft, IconChevronRight, 
    IconPlus, IconMinus, IconMenu, IconSettings, IconCheck, 
    IconSun, IconMoon
} from '../constants';
import { Document, Page, pdfjs } from 'react-pdf';
import MorphicEye from '../components/MorphicEye';

const { useParams, useNavigate } = ReactRouterDOM as any;

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

// --- READER SETTINGS TYPES ---
type ReaderTheme = 'dark' | 'light' | 'sepia';
type FontFamily = 'sans' | 'serif' | 'mono';

interface ReaderSettings {
    theme: ReaderTheme;
    fontSize: number;
    lineHeight: number;
    fontFamily: FontFamily;
}

const EbookReaderPage: React.FC = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userType, allBooks } = useAppContext();
    
    // Data State
    const [book, setBook] = useState<EBook | null>(null);
    const [loading, setLoading] = useState(true);
    
    // UI State
    const [showSidebar, setShowSidebar] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<ReaderSettings>({
        theme: 'dark',
        fontSize: 18,
        lineHeight: 1.8,
        fontFamily: 'serif'
    });

    // PDF State
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

    // Text Reader State
    const [textPageIndex, setTextPageIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        const loadBook = async () => {
            if (!bookId) return;
            setLoading(true);

            // Find Book Logic
            let foundBook = allBooks.find(b => b.id === bookId);
            if (!foundBook && currentUser) {
                 if (userType === UserType.SELLER) {
                     foundBook = (currentUser as Seller).uploadedBooks?.find(b => b.id === bookId);
                 } else if (userType === UserType.USER) {
                     foundBook = (currentUser as User).purchaseHistory?.find(b => b.id === bookId);
                 }
            }

            if (foundBook) {
                 // Access Logic
                 const isFree = foundBook.price === 0;
                 let hasAccess = isFree;

                 if (!hasAccess && currentUser) {
                     if (userType === UserType.SELLER) {
                         hasAccess = foundBook.sellerId === currentUser.id; 
                     } else if (userType === UserType.USER) {
                         hasAccess = (currentUser as User).purchaseHistory?.some(b => b.id === bookId);
                     }
                 }
                 
                 if (hasAccess) {
                     setBook(foundBook);
                     if (foundBook.pdfUrl) {
                         try {
                             const res = await fetch(foundBook.pdfUrl);
                             const blob = await res.blob();
                             const blobUrl = URL.createObjectURL(blob);
                             setPdfBlobUrl(blobUrl);
                         } catch (e) {
                             setPdfBlobUrl(foundBook.pdfUrl);
                         }
                     }
                 } else {
                     if (!currentUser && !isFree) {
                         navigate('/login');
                         return;
                     } else if (currentUser) {
                         alert("Access denied. Please purchase this book.");
                         navigate('/store');
                         return;
                     }
                 }
            }
            setLoading(false);
        };
        loadBook();
    }, [bookId, currentUser, userType, navigate, allBooks]);

    useEffect(() => {
        return () => {
            if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [pdfBlobUrl]);

    // --- HELPERS ---
    const getThemeClasses = () => {
        switch (settings.theme) {
            case 'light': return 'bg-[#f8f9fa] text-neutral-900 selection:bg-yellow-200';
            case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636] selection:bg-[#d6cbb1]';
            case 'dark': 
            default: return 'bg-[#0a0a0a] text-[#d4d4d4] selection:bg-white/20';
        }
    };
    
    const getPageThemeClasses = () => {
         switch (settings.theme) {
            case 'light': return 'bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] border-neutral-200';
            case 'sepia': return 'bg-[#faf4e8] shadow-[0_0_50px_rgba(91,70,54,0.1)] border-[#e3d8c4]';
            case 'dark': 
            default: return 'bg-[#111] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-white/5';
        }
    };

    const getFontFamily = () => {
        switch (settings.fontFamily) {
            case 'sans': return 'font-sans';
            case 'mono': return 'font-mono';
            case 'serif': 
            default: return 'font-serif';
        }
    };

    // --- MARKDOWN RENDERER ---
    const renderMarkdownContent = (content: string) => {
        // Split text by markdown image syntax ![alt](url)
        // Regex captures the whole image tag
        const parts = content.split(/(!\[.*?\]\(.*?\))/g);
        
        return parts.map((part, index) => {
            // Check if this part is an image
            const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
                return (
                    <div key={index} className="my-8 flex flex-col items-center group">
                        <div className="relative rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-black">
                            <img 
                                src={imageMatch[2]} 
                                alt={imageMatch[1]} 
                                className="max-h-[500px] w-auto object-contain transition-transform duration-500 hover:scale-[1.02]" 
                            />
                        </div>
                        {imageMatch[1] && <span className="text-[10px] text-neutral-500 mt-3 font-mono uppercase tracking-widest">{imageMatch[1]}</span>}
                    </div>
                );
            }
            
            // Render text with basic formatting (Headers, Bold, Newlines)
            return (
                <div key={index} className="whitespace-pre-wrap">
                    {part.split('\n').map((line, i) => {
                        // Skip empty lines in some contexts or render as spacer
                        if (!line.trim()) return <div key={i} className="h-4"></div>;

                        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl md:text-4xl font-bold mb-6 mt-8 leading-tight">{line.replace('# ', '')}</h1>
                        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mb-4 mt-6 leading-snug opacity-90">{line.replace('## ', '')}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mb-3 mt-5 leading-snug opacity-80">{line.replace('### ', '')}</h3>
                        if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc mb-2 pl-2">{line.replace('- ', '')}</li>
                        
                        // Parse Bold **text** within paragraph
                        const lineParts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                            <p key={i} className="mb-4 leading-relaxed">
                                {lineParts.map((sub, j) => {
                                    if (sub.startsWith('**') && sub.endsWith('**')) {
                                        return <strong key={j} className="font-bold opacity-100">{sub.slice(2, -2)}</strong>;
                                    }
                                    return sub;
                                })}
                            </p>
                        )
                    })}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <MorphicEye className="w-16 h-16 mb-6 border border-white/20 bg-black shadow-[0_0_30px_white/20] rounded-full" />
                <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Reader Engine...</p>
            </div>
        );
    }

    if (!book) return null;

    // --- RENDER CONTENT ---
    const pages = book.pages && book.pages.length > 0 ? book.pages : [{ id: '1', title: 'Cover', pageNumber: 1, content: "No content available." }];
    const currentTextPage = pages[textPageIndex];
    const progress = book.pdfUrl 
        ? Math.round((pageNumber / numPages) * 100)
        : Math.round(((textPageIndex + 1) / pages.length) * 100);

    return (
        <div className={`min-h-screen w-full flex flex-col fixed inset-0 z-50 transition-colors duration-500 font-sans ${getThemeClasses()}`}>
            
            {/* === HEADER (Glassmorphism) === */}
            <header className={`
                h-16 flex items-center justify-between px-4 md:px-8 border-b z-40 relative backdrop-blur-xl transition-colors duration-300
                ${settings.theme === 'dark' ? 'bg-black/80 border-white/10' : settings.theme === 'light' ? 'bg-white/80 border-black/5' : 'bg-[#f4ecd8]/80 border-[#5b4636]/10'}
            `}>
                <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    <button onClick={() => navigate(-1)} className="group p-2 rounded-full hover:bg-black/5 transition-all" title="Exit">
                        <IconX className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-500 group-hover:text-black'}`} />
                    </button>
                    <button onClick={() => setShowSidebar(true)} className="group p-2 rounded-full hover:bg-black/5 transition-all" title="Table of Contents">
                         <IconMenu className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-500 group-hover:text-black'}`} />
                    </button>
                    {/* Allow title to show on mobile but truncate heavily */}
                    <h1 className="text-sm font-bold truncate opacity-80 flex-1 min-w-0">{book.title}</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    {/* Settings Toggle (Text Mode Only) */}
                    {!book.pdfUrl && (
                        <div className="relative">
                            <button 
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-2 rounded-full transition-all border ${showSettings ? 'bg-black/5' : 'bg-transparent border-transparent'} ${settings.theme === 'dark' ? 'hover:bg-white/10 text-neutral-300' : 'hover:bg-black/5 text-neutral-600'}`}
                            >
                                <span className="font-serif font-bold text-lg">Aa</span>
                            </button>
                            
                            {/* Settings Dropdown */}
                            {showSettings && (
                                <div className={`absolute top-12 right-0 w-72 p-5 rounded-2xl shadow-2xl border animate-slide-up origin-top-right z-50
                                    ${settings.theme === 'dark' ? 'bg-[#1a1a1a] border-white/10 text-white' : 'bg-white border-neutral-200 text-neutral-900'}
                                `}>
                                    {/* Theme */}
                                    <div className="flex bg-black/5 rounded-lg p-1 mb-6 border border-black/5">
                                        {[
                                            { id: 'light', icon: <IconSun className="w-4 h-4" />, label: 'Light' },
                                            { id: 'sepia', icon: <div className="w-3 h-3 rounded-full bg-[#d6cbb1]"></div>, label: 'Sepia' },
                                            { id: 'dark', icon: <IconMoon className="w-4 h-4" />, label: 'Dark' },
                                        ].map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSettings(prev => ({ ...prev, theme: t.id as ReaderTheme }))}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                                    ${settings.theme === t.id 
                                                        ? (settings.theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') 
                                                        : 'hover:bg-black/5 text-neutral-500'
                                                    }
                                                `}
                                            >
                                                {t.icon} {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Font Family */}
                                    <div className="mb-6">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Typography</p>
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'sans', label: 'Sans', font: 'font-sans' },
                                                { id: 'serif', label: 'Serif', font: 'font-serif' },
                                                { id: 'mono', label: 'Mono', font: 'font-mono' },
                                            ].map(f => (
                                                <button 
                                                    key={f.id}
                                                    onClick={() => setSettings(prev => ({ ...prev, fontFamily: f.id as FontFamily }))}
                                                    className={`flex-1 py-3 border rounded-lg text-sm transition-all ${f.font}
                                                        ${settings.fontFamily === f.id ? 'border-current bg-current/5' : 'border-transparent bg-black/5 hover:bg-black/10'}
                                                    `}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Size */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Size</span>
                                            <span className="text-xs font-mono">{settings.fontSize}px</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.max(12, prev.fontSize - 1) }))} className="p-2 hover:bg-black/5 rounded"><span className="text-xs font-bold">A-</span></button>
                                            <input 
                                                type="range" min="12" max="32" 
                                                value={settings.fontSize} 
                                                onChange={(e) => setSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                                                className="flex-1 h-1 bg-neutral-500/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:rounded-full"
                                            />
                                            <button onClick={() => setSettings(prev => ({ ...prev, fontSize: Math.min(32, prev.fontSize + 1) }))} className="p-2 hover:bg-black/5 rounded"><span className="text-lg font-bold">A+</span></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Progress Indicator - Hidden on very small screens, visible on md+ */}
                    <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full border border-current/10 bg-current/5">
                        <span className="text-xs font-bold tabular-nums">{progress}%</span>
                        <div className="w-16 h-1 bg-current/20 rounded-full overflow-hidden">
                            <div className="h-full bg-current transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* === SIDEBAR (Table of Contents) === */}
            {showSidebar && (
                <div className="fixed inset-0 z-[60] flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSidebar(false)}></div>
                    <div className={`relative w-80 h-full shadow-2xl flex flex-col animate-slide-right border-r ${settings.theme === 'dark' ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-neutral-200'}`}>
                        <div className="p-6 border-b border-current/10 flex items-center justify-between">
                            <h3 className="font-bold text-sm uppercase tracking-widest">Chapters</h3>
                            <button onClick={() => setShowSidebar(false)}><IconX className="w-5 h-5"/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {pages.map((p, idx) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setTextPageIndex(idx);
                                        setShowSidebar(false);
                                        contentRef.current?.scrollTo(0,0);
                                    }}
                                    className={`w-full text-left p-4 rounded-xl transition-all border ${
                                        textPageIndex === idx 
                                        ? 'bg-current/10 border-current/20 font-bold' 
                                        : 'bg-transparent border-transparent hover:bg-current/5 text-current/60'
                                    }`}
                                >
                                    <span className="text-xs opacity-50 block mb-1">Chapter {idx + 1}</span>
                                    <span className="text-sm">{p.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === MAIN CONTENT === */}
            <main className="flex-1 relative overflow-hidden flex flex-col pb-24"> 
                
                {/* --- PDF MODE --- */}
                {book.pdfUrl && pdfBlobUrl ? (
                    <div className="flex-1 relative bg-black/50 overflow-auto flex justify-center p-4 md:p-10 custom-scrollbar pb-32">
                        <div className={`shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/5 transition-transform origin-top`} style={{ transform: `scale(${scale})` }}>
                            <Document
                                file={pdfBlobUrl}
                                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                                loading={<div className="text-white p-10 font-mono text-xs">Loading Document...</div>}
                                error={<div className="text-red-400 p-10 font-mono text-xs">PDF Error</div>}
                            >
                                <Page 
                                    pageNumber={pageNumber} 
                                    scale={1} 
                                    className="shadow-2xl"
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                        
                        {/* Floating PDF Controls */}
                        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-full flex items-center gap-4 shadow-2xl z-40 text-white">
                             <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"><IconChevronLeft className="w-5 h-5"/></button>
                             <span className="font-mono text-xs font-bold">{pageNumber} / {numPages}</span>
                             <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"><IconChevronRight className="w-5 h-5"/></button>
                             <div className="w-px h-6 bg-white/20 mx-2"></div>
                             <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-2 hover:text-white text-neutral-400"><IconMinus className="w-4 h-4"/></button>
                             <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:text-white text-neutral-400"><IconPlus className="w-4 h-4"/></button>
                        </div>
                    </div>
                ) : (
                    /* --- TEXT MODE --- */
                    <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                        <div className="max-w-3xl mx-auto py-8 md:py-12 px-4 md:px-0">
                            
                            {/* The "Page" */}
                            <div className={`
                                min-h-[calc(100vh-200px)] p-6 md:p-16 rounded-[12px] transition-all duration-300 border
                                ${getPageThemeClasses()}
                            `}>
                                <div className="mb-8 md:mb-12 text-center pb-8 border-b border-current/10">
                                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-3">Chapter {textPageIndex + 1}</h4>
                                    <h2 className={`text-2xl md:text-5xl font-bold leading-tight ${settings.fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}>
                                        {currentTextPage.title}
                                    </h2>
                                </div>

                                <article 
                                    className={`prose prose-base md:prose-lg max-w-none transition-all duration-300 ${getFontFamily()}`}
                                    style={{ 
                                        fontSize: `${settings.fontSize}px`, 
                                        lineHeight: settings.lineHeight,
                                        color: 'currentColor' 
                                    }}
                                >
                                    <div className="opacity-90">
                                        {renderMarkdownContent(currentTextPage.content || "Start writing to see content here...")}
                                    </div>
                                </article>

                                {/* Page Footer */}
                                <div className="mt-12 md:mt-20 pt-10 border-t border-current/10 flex flex-col md:flex-row gap-4 justify-between items-center opacity-50 text-[10px] md:text-xs font-mono uppercase tracking-widest text-center md:text-left">
                                     <span>{book.title}</span>
                                     <span>{textPageIndex + 1} / {pages.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* === FIXED BOTTOM NAVIGATION (Text Mode) === */}
            {!book.pdfUrl && (
                <div className={`fixed bottom-0 left-0 right-0 p-4 border-t z-50 backdrop-blur-xl ${settings.theme === 'dark' ? 'bg-black/90 border-white/10' : settings.theme === 'light' ? 'bg-white/90 border-black/10' : 'bg-[#f4ecd8]/90 border-[#5b4636]/10'}`}>
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <button 
                            onClick={() => {
                                if (textPageIndex > 0) {
                                    setTextPageIndex(p => p - 1);
                                    contentRef.current?.scrollTo(0,0);
                                }
                            }}
                            disabled={textPageIndex === 0}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all border ${settings.theme === 'dark' ? 'hover:bg-white/10 border-white/10 text-white disabled:opacity-30' : 'hover:bg-black/5 border-black/10 text-black disabled:opacity-30'}`}
                        >
                            <IconChevronLeft className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase tracking-wider">Prev</span>
                        </button>

                        <div className={`text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 ${settings.theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            {textPageIndex + 1} / {pages.length}
                        </div>

                        <button 
                            onClick={() => {
                                if (textPageIndex < pages.length - 1) {
                                    setTextPageIndex(p => p + 1);
                                    contentRef.current?.scrollTo(0,0);
                                }
                            }}
                            disabled={textPageIndex === pages.length - 1}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all border ${settings.theme === 'dark' ? 'hover:bg-white/10 border-white/10 text-white disabled:opacity-30' : 'hover:bg-black/5 border-black/10 text-black disabled:opacity-30'}`}
                        >
                            <span className="font-bold text-xs uppercase tracking-wider">Next</span>
                            <IconChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EbookReaderPage;
