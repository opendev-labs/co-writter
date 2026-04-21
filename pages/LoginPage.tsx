
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME, IconSparkles, IconMail, IconLock, IconArrowRight, IconBook } from '../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { UserType } from '../types';

const { useNavigate } = ReactRouterDOM as any;

const LoginPage: React.FC = () => {
    const { handleEmailLogin, handleGoogleLogin, setCurrentUser } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isPhoneMode, setIsPhoneMode] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const success = await handleEmailLogin(email, password);
        if (success) navigate('/dashboard');
        else alert('Invalid credentials');
        setIsProcessing(false);
    };

    const onGoogleLogin = async () => {
        setIsProcessing(true);
        const success = await handleGoogleLogin();
        if (success) navigate('/dashboard');
        setIsProcessing(false);
    };

    const { handlePhoneLogin, verifyOtp } = useAppContext();

    const onPhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const res = await handlePhoneLogin(phoneNumber, 'recaptcha-container');
        if (res.success) {
            setConfirmationResult(res.confirmationResult);
        } else {
            alert('Failed to send OTP. Please check your phone number.');
        }
        setIsProcessing(false);
    };

    const onOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        const res = await verifyOtp(confirmationResult, otp);
        if (res.success) {
            navigate('/dashboard');
        } else {
            alert('Invalid OTP');
        }
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen w-full relative bg-black selection:bg-white/20 font-sans flex items-center justify-center p-4">
            
            {/* === Background Effects === */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]"></div>
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="bg-black border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
                    {/* Top Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>

                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-white animate-float">
                            <IconBook className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Welcome Back</h1>
                        <p className="text-neutral-500 text-sm">Sign in to your neural workspace</p>
                    </div>

                    {!isPhoneMode ? (
                        <form onSubmit={onEmailLogin} className="space-y-4">
                            <div className="relative">
                                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    type="email" 
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors text-sm font-medium"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    type="password" 
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors text-sm font-medium"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-glow-white flex items-center justify-center gap-2 group mt-6 uppercase tracking-widest text-xs"
                            >
                                {isProcessing ? 'Authenticating...' : (
                                    <>
                                        Login <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {!confirmationResult ? (
                                <form onSubmit={onPhoneSubmit} className="space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-medium">+</span>
                                        <input 
                                            type="tel" 
                                            placeholder="Phone Number (e.g. +919876543210)"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div id="recaptcha-container"></div>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-glow-white flex items-center justify-center gap-2 group mt-6 uppercase tracking-widest text-xs"
                                    >
                                        {isProcessing ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={onOtpSubmit} className="space-y-4">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors text-center text-xl font-bold tracking-[0.5em]"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-glow-white flex items-center justify-center gap-2 group mt-6 uppercase tracking-widest text-xs"
                                    >
                                        {isProcessing ? 'Verifying...' : 'Verify & Continue'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-black px-4 text-neutral-600">OR</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={onGoogleLogin}
                            disabled={isProcessing}
                            className="w-full py-4 border border-white/10 rounded-full text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button 
                            onClick={() => setIsPhoneMode(!isPhoneMode)}
                            disabled={isProcessing}
                            className="w-full py-4 border border-white/10 rounded-full text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                            </svg>
                            {isPhoneMode ? 'Email' : 'Phone'}
                        </button>
                    </div>
                    
                    {/* Developer Login */}
                    {import.meta.env.DEV && (
                        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2">
                             <button 
                                onClick={() => {
                                    setCurrentUser({
                                        id: 'dev-user',
                                        name: 'Dev Author',
                                        email: 'dev@co-writter.io',
                                        isVerified: true,
                                        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev'
                                    }, UserType.USER);
                                    navigate('/dashboard');
                                }}
                                className="w-full py-2 border border-indigo-500/20 rounded-xl text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/10 transition-colors"
                            >
                                [DEV] Login as Reader
                            </button>
                            <button 
                                onClick={() => {
                                    setCurrentUser({
                                        id: 'dev-seller',
                                        name: 'Dev Creator',
                                        email: 'creator@co-writter.io',
                                        isVerified: true,
                                        profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
                                        username: '@devcreator',
                                        payoutEmail: 'creator@co-writter.io',
                                        uploadedBooks: [],
                                        creatorSite: {
                                            isEnabled: true,
                                            slug: 'dev-creator',
                                            theme: 'dark-minimal',
                                            displayName: 'Dev Creator',
                                            tagline: 'Building the future of books',
                                            showcasedBookIds: []
                                        }
                                    }, UserType.SELLER);
                                    navigate('/dashboard');
                                }}
                                className="w-full py-2 border border-purple-500/20 rounded-xl text-purple-400 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/10 transition-colors"
                            >
                                [DEV] Login as Writer
                            </button>
                        </div>
                    )}
                </div>
                
                <p className="mt-8 text-center text-neutral-500 text-xs uppercase tracking-widest">
                    By continuing, you agree to our <a href="/terms" className="text-white hover:underline">Terms of Service</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
