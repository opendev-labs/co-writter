
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { IconSparkles, IconBook, IconRocket, IconStore, IconCheck, IconBrain } from '../constants';
import MorphicEye from '../components/MorphicEye';
import { useAppContext } from '../contexts/AppContext';

const { Link, useNavigate } = ReactRouterDOM as any;

// Tech Stack Icons
const TechIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex flex-col items-center gap-4 group cursor-default transition-all duration-300 hover:-translate-y-2">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
                {icon}
            </div>
        </div>
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-600 group-hover:text-neutral-300 transition-colors">{label}</span>
    </div>
);

const LogoReact = () => (
    <svg viewBox="-10.5 -9.45 21 18.9" className="w-12 h-12 md:w-16 md:h-16 fill-current text-[#61DAFB]">
        <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
        <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="10" ry="4.5"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
        </g>
    </svg>
);

const LogoVite = () => (
    <svg viewBox="0 0 32 32" className="w-12 h-12 md:w-16 md:h-16 text-[#646CFF]">
        <path d="M30.3 5.4L16.6 29.5 2.8 5.4h27.5z" fill="currentColor" fillOpacity="0.2" />
        <path d="M16.6 29.5L2.8 5.4h11l2.8 17.5 2.8-17.5h10.9L16.6 29.5z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M2.8 5.4h11L16.6 29.5 2.8 5.4z" fill="currentColor" fillOpacity="0.1" />
    </svg>
);

const LogoTS = () => (
    <svg viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16 text-[#3178C6]">
        <rect width="128" height="128" rx="20" fill="currentColor" fillOpacity="0.1" />
        <path d="M29.1 56.1h21.9v10.4h-7.9v35.1h-11v-35.1h-7.9v-10.4h4.9zm41.6 34.6c2.4 1.7 6.4 3.7 10.4 3.7 4.2 0 6.2-2.1 6.2-5.1 0-8.6-24.6-9-24.6-25.1 0-9.8 8.1-16.7 21.6-16.7 6.5 0 10.9 1.6 13.9 3l-2.6 10.4c-2.6-1.3-6.4-2.7-10.7-2.7-4.1 0-6.1 2.2-6.1 4.7 0 8.3 24.6 9.3 24.6 25 0 10.5-9.1 17.1-22.1 17.1-6.8 0-12.7-2.1-15.6-3.8l3-10.5z" fill="currentColor" />
    </svg>
);

const LogoTailwind = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 fill-current text-[#38B2AC]">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
    </svg>
);

const LogoGoogle = () => (
    <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAppContext();

    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-google-blue/30 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center pt-32 pb-20 z-10">

                {/* Local Hero Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-google-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 animate-slide-up flex flex-col items-center max-w-5xl mx-auto">

                    <div className="mb-8 md:mb-10 scale-100 hover:scale-105 transition-transform duration-500">
                        <MorphicEye className="w-24 h-24 md:w-40 md:h-40 bg-[#050505] shadow-[0_0_80px_rgba(255,255,255,0.15)] border border-white/30 rounded-full" />
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.95] md:leading-[0.9] drop-shadow-2xl">
                        Turn Your Ideas<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">Into Books.</span>
                    </h1>

                    <p className="text-base md:text-xl text-neutral-300 max-w-2xl mb-10 leading-relaxed px-4 drop-shadow-md">
                        The easiest way to write, read, and sell books with AI.
                        <br className="my-2 block" />
                        <span className="inline-block mt-1">Powered by <span className="text-white font-mono font-bold border-b border-white/20 pb-0.5">GOOGLE</span>.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
                        {currentUser ? (
                            <button
                                onClick={() => navigate('/ebook-studio')}
                                className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group"
                            >
                                <IconRocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Start Writing
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
                                >
                                    Start Creating
                                </Link>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-10 py-4 bg-black/40 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-neutral-400 text-xs font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-2"><IconCheck className="w-3 h-3 text-google-green" /> Easy to Use</span>
                        <span className="flex items-center gap-2"><IconCheck className="w-3 h-3 text-google-green" /> Free to Start</span>
                        <span className="flex items-center gap-2"><IconCheck className="w-3 h-3 text-google-green" /> Instant Publishing</span>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-24 px-6 border-b border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Feature 1: AI Co-Author */}
                        <div className="p-8 rounded-[32px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-white/20 hover:scale-105 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                <IconBrain className="w-7 h-7 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">AI Co-Author</h3>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                Write with AI. Plan your chapters, write full pages, and fix grammar easily with our writing tools.
                            </p>
                        </div>

                        {/* Feature 2: Sell Your Books */}
                        <div className="p-8 rounded-[32px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-white/20 hover:scale-110 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <IconRocket className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">Sell Your Books</h3>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                Publish your book instantly. Get your own profile link and keep 70% of every sale you make.
                            </p>
                        </div>

                        {/* Feature 3: Easy Reading */}
                        <div className="p-8 rounded-[32px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-white/20 hover:scale-110 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                                <IconBook className="w-7 h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">Easy Reading</h3>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                Read comfortably on any device. Support for PDF uploads and a distraction-free reading mode.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- NANOPI SECTION --- */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[40px] overflow-hidden border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-transparent to-cyan-900/20 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-10 md:p-16">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                                <svg viewBox="0 0 24 24" className="w-14 h-14 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                                    <path d="M2 12h3m14 0h3M12 2v3m0 14v3" strokeLinecap="round" />
                                    <path d="M4.93 4.93l2.12 2.12m9.9 9.9 2.12 2.12M19.07 4.93l-2.12 2.12m-9.9 9.9-2.12 2.12" strokeLinecap="round" />
                                </svg>
                            </div>

                            {/* Text */}
                            <div className="flex-grow text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono uppercase tracking-widest mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                    Powered by NanoPi
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                                    Meet Your AI Writing Partner
                                </h2>
                                <p className="text-neutral-400 leading-relaxed mb-8 text-base md:text-lg max-w-xl">
                                    Co-Writter is supercharged by <span className="text-violet-300 font-semibold">NanoPi</span> — the photonic intelligence model that thinks like a physicist and writes like a novelist. Get instant suggestions, plot generation, and narrative continuity analysis.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                                    <a
                                        href="https://opendev-labs-nanopi.hf.space/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center gap-2"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 0-2 0v1.93A8 8 0 0 1 4.07 13H6a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V6a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H18a1 1 0 0 0 0 2h1.93A8 8 0 0 1 13 19.93z" /></svg>
                                        Launch NanoPi
                                    </a>
                                    <span className="text-xs text-neutral-600 font-mono">opendev-labs-nanopi.hf.space</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ABOUT --- */}
            <section className="py-24 px-6 relative overflow-hidden z-10">
                <div className="max-w-4xl mx-auto text-center bg-black/30 backdrop-blur-lg border border-white/5 p-12 rounded-[40px] shadow-2xl relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Built for Everyone</h2>
                    <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-12 font-light">
                        Co-Writter isn't just a tool; it's a partner. We believe that everyone has a story worth telling,
                        and with the right help, anyone can become an author.
                    </p>
                    <Link to="/store" className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1 hover:opacity-70 transition-opacity tracking-widest uppercase text-sm">
                        Browse the Library &rarr;
                    </Link>
                </div>
            </section>

            {/* --- TECH STACK SHOWCASE --- */}
            <section className="py-20 border-t border-b border-white/5 bg-black/40 backdrop-blur relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-500 mb-12">Built With Modern Architecture</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        <TechIcon label="Google Gemini" icon={<LogoGoogle />} />
                        <TechIcon label="React 18" icon={<LogoReact />} />
                        <TechIcon label="TypeScript" icon={<LogoTS />} />
                        <TechIcon label="Tailwind CSS" icon={<LogoTailwind />} />
                        <TechIcon label="Vite" icon={<LogoVite />} />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
