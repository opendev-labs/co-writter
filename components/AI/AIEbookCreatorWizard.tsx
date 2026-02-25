
import React, { useState } from 'react';
import { IconSparkles, IconWand, IconLink, IconCheck, IconX, IconBook } from '../../constants';
import Spinner from '../Spinner';
import { generateTitleSuggestions, generateBookOutline, generateFullChapterContent } from '../../services/geminiService';
import { ChapterOutline, AnalyzedStyle } from '../../types';

interface AIEbookCreatorWizardProps {
    onComplete: (data: { title: string; pages: { title: string; content: string }[]; style?: AnalyzedStyle }) => void;
    onCancel: () => void;
}

const AIEbookCreatorWizard: React.FC<AIEbookCreatorWizardProps> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState<'mode' | 'details' | 'outline' | 'generation'>('mode');
    
    // Import Mode
    const [canvaLink, setCanvaLink] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedStyle, setAnalyzedStyle] = useState<AnalyzedStyle | null>(null);

    // Details Mode
    const [topic, setTopic] = useState('');
    const [genre, setGenre] = useState('');
    const [tone, setTone] = useState('Professional');
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);

    // Outline Mode
    const [outline, setOutline] = useState<ChapterOutline[]>([]);
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

    // Generation Mode
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);

    const handleAnalyzeCanva = () => {
        if (!canvaLink) return;
        setIsAnalyzing(true);
        // Simulation of analysis logic based on the user's prompt description
        setTimeout(() => {
            setAnalyzedStyle({
                fontPrimary: 'Playfair Display',
                fontSecondary: 'Inter',
                colorPrimary: '#2C5530', // Deep Green
                colorSecondary: '#D4AF37', // Gold
                colorBackground: '#FEFDF7', // Cream
                colorText: '#2D3748'
            });
            setIsAnalyzing(false);
            setStep('details');
        }, 2000);
    };

    const handleGenerateTitles = async () => {
        if (!topic || !genre) return;
        setIsGeneratingTitles(true);
        const titles = await generateTitleSuggestions(topic, genre, tone);
        setTitleSuggestions(titles);
        setIsGeneratingTitles(false);
    };

    const handleGenerateOutline = async () => {
        if (!selectedTitle) return;
        setIsGeneratingOutline(true);
        const chapters = await generateBookOutline(selectedTitle, genre, tone);
        setOutline(chapters);
        setIsGeneratingOutline(false);
        setStep('outline');
    };

    const handleGenerateFullEbook = async () => {
        setIsGeneratingContent(true);
        setStep('generation');
        
        const generatedPages = [];
        let completed = 0;

        for (const chapter of outline) {
            const content = await generateFullChapterContent(chapter.title, selectedTitle, chapter.summary, tone);
            generatedPages.push({
                title: chapter.title,
                content: content
            });
            completed++;
            setGenerationProgress(Math.round((completed / outline.length) * 100));
        }

        setIsGeneratingContent(false);
        onComplete({
            title: selectedTitle,
            pages: generatedPages,
            style: analyzedStyle || undefined
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] w-full max-w-4xl h-[600px] rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden relative">
                
                {/* Left Sidebar Steps */}
                <div className="w-64 bg-[#111] border-r border-white/5 p-6 flex flex-col justify-between hidden md:flex">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <IconSparkles className="w-5 h-5 text-google-blue"/> AI Creator
                        </h2>
                        <div className="space-y-6">
                            {[
                                { id: 'mode', label: 'Start' },
                                { id: 'details', label: 'Concept' },
                                { id: 'outline', label: 'Structure' },
                                { id: 'generation', label: 'Generate' }
                            ].map((s, idx) => {
                                const isActive = step === s.id;
                                const isPast = ['mode', 'details', 'outline', 'generation'].indexOf(step) > idx;
                                return (
                                    <div key={s.id} className={`flex items-center gap-3 ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isActive ? 'border-white bg-white/10' : isPast ? 'bg-green-500 border-green-500 text-black' : 'border-neutral-700'}`}>
                                            {isPast ? <IconCheck className="w-3 h-3"/> : idx + 1}
                                        </div>
                                        <span className="text-sm font-medium">{s.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {analyzedStyle && (
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Style Active</p>
                            <div className="flex gap-2">
                                <div className="w-4 h-4 rounded-full" style={{background: analyzedStyle.colorPrimary}}></div>
                                <div className="w-4 h-4 rounded-full" style={{background: analyzedStyle.colorSecondary}}></div>
                                <div className="w-4 h-4 rounded-full" style={{background: analyzedStyle.colorBackground}}></div>
                            </div>
                            <p className="text-xs text-white mt-1 font-serif">Canva Theme</p>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
                    <button onClick={onCancel} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <IconX className="w-5 h-5" />
                    </button>

                    {step === 'mode' && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                            <h3 className="text-3xl font-bold text-white mb-2">Start a New Project</h3>
                            <p className="text-neutral-400 mb-8">Choose how you want to begin your creative journey.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <button 
                                    onClick={() => setStep('details')}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all group text-left"
                                >
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <IconWand className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h4 className="font-bold text-white mb-1">From Scratch</h4>
                                    <p className="text-xs text-neutral-400">Let AI guide you through topic, genre, and outline creation.</p>
                                </button>

                                <button 
                                    onClick={() => {}}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all group text-left relative overflow-hidden"
                                >
                                     {/* Input Overlay for Canva */}
                                     <div className="space-y-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <IconLink className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <h4 className="font-bold text-white mb-1">Import from Canva</h4>
                                        <p className="text-xs text-neutral-400 mb-3">Analyze a public link and replicate the design style.</p>
                                        
                                        <div className="relative">
                                            <input 
                                                value={canvaLink}
                                                onChange={(e) => setCanvaLink(e.target.value)}
                                                placeholder="Paste Canva View Link..."
                                                className="w-full bg-black border border-white/20 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAnalyzeCanva(); }}
                                                disabled={isAnalyzing || !canvaLink}
                                                className="mt-2 w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-full transition-colors disabled:opacity-50"
                                            >
                                                {isAnalyzing ? 'Analyzing...' : 'Analyze & Import'}
                                            </button>
                                        </div>
                                     </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'details' && (
                        <div className="max-w-xl mx-auto py-10">
                            <h3 className="text-2xl font-bold text-white mb-6">Book Concept</h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Topic / Subject</label>
                                    <input 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full bg-[#151515] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
                                        placeholder="e.g. Artificial Intelligence in 2030"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Genre</label>
                                        <select 
                                            value={genre} 
                                            onChange={e => setGenre(e.target.value)}
                                            className="w-full bg-[#151515] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 appearance-none"
                                        >
                                            <option value="">Select Genre</option>
                                            <option value="Non-Fiction">Non-Fiction</option>
                                            <option value="Fiction">Fiction</option>
                                            <option value="Sci-Fi">Sci-Fi</option>
                                            <option value="Business">Business</option>
                                            <option value="Self-Help">Self-Help</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Tone</label>
                                        <select 
                                            value={tone} 
                                            onChange={e => setTone(e.target.value)}
                                            className="w-full bg-[#151515] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 appearance-none"
                                        >
                                            <option value="Professional">Professional</option>
                                            <option value="Conversational">Conversational</option>
                                            <option value="Inspirational">Inspirational</option>
                                            <option value="Academic">Academic</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGenerateTitles}
                                    disabled={!topic || !genre || isGeneratingTitles}
                                    className="text-sm font-bold text-google-blue hover:text-white transition-colors flex items-center gap-2"
                                >
                                    {isGeneratingTitles ? <Spinner size="sm" /> : <><IconSparkles className="w-4 h-4"/> Suggest Titles</>}
                                </button>

                                {titleSuggestions.length > 0 && (
                                    <div className="space-y-2 mt-2">
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Select a Title</label>
                                        {titleSuggestions.map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => setSelectedTitle(t)}
                                                className={`w-full text-left p-3 rounded-lg border transition-all ${selectedTitle === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button 
                                    onClick={handleGenerateOutline}
                                    disabled={!selectedTitle}
                                    className="w-full py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors mt-4 disabled:opacity-50 text-xs uppercase tracking-widest"
                                >
                                    Generate Outline &rarr;
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'outline' && (
                        <div className="max-w-xl mx-auto py-10">
                            <h3 className="text-2xl font-bold text-white mb-2">{selectedTitle}</h3>
                            <p className="text-neutral-500 mb-6">Proposed Chapter Outline</p>

                            {isGeneratingOutline ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Spinner size="lg" />
                                    <p className="text-neutral-500 mt-4 animate-pulse">Structuring your book...</p>
                                </div>
                            ) : (
                                <div className="space-y-3 mb-8">
                                    {outline.map((chapter, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-bold text-white">Chapter {idx + 1}: {chapter.title}</h4>
                                            </div>
                                            <p className="text-sm text-neutral-400">{chapter.summary}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isGeneratingOutline && (
                                <button 
                                    onClick={handleGenerateFullEbook}
                                    className="w-full py-4 bg-gradient-to-r from-google-blue to-purple-600 text-white font-bold rounded-full hover:shadow-glow-blue transition-all uppercase tracking-widest text-xs"
                                >
                                    <IconSparkles className="w-5 h-5 inline-block mr-2" />
                                    Generate Full Ebook
                                </button>
                            )}
                        </div>
                    )}

                    {step === 'generation' && (
                        <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                            <div className="w-24 h-24 mb-6 relative">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="45" fill="none" stroke="#1a1a1a" strokeWidth="6" />
                                    <circle cx="48" cy="48" r="45" fill="none" stroke="#8ab4f8" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * generationProgress) / 100} className="transition-all duration-500" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                                    {generationProgress}%
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Writing your Masterpiece</h3>
                            <p className="text-neutral-400">Gemini is drafting chapters, formatting content, and applying styles.</p>
                            
                            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 w-full text-left">
                                <p className="text-xs font-mono text-google-green mb-1">> Initializing Neural Engine...</p>
                                {generationProgress > 10 && <p className="text-xs font-mono text-neutral-400 mb-1">> Analyzing outline structure...</p>}
                                {generationProgress > 30 && <p className="text-xs font-mono text-neutral-400 mb-1">> Drafting content batches...</p>}
                                {generationProgress > 70 && <p className="text-xs font-mono text-neutral-400 mb-1">> Applying typographic rules...</p>}
                                {generationProgress === 100 && <p className="text-xs font-mono text-google-blue mb-1">> Finalizing asset compilation...</p>}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AIEbookCreatorWizard;
