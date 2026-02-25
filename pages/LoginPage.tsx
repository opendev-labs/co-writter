
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME, GOOGLE_CLIENT_ID, IconRocket, IconUser } from '../constants';
import { UserType, User } from '../types';
import MorphicEye from '../components/MorphicEye';

const { useNavigate, Link } = ReactRouterDOM as any;

declare global {
    interface Window {
        google: any;
    }
}

// Official Colored Google "G" Icon
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

const LoginPage: React.FC = () => {
    const { currentUser, userType, setCurrentUser, handleEmailLogin } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Login Mode: 'social' or 'email'
    const [loginMode, setLoginMode] = useState<'social' | 'email'>('social');

    // Email Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // If already logged in, redirect to dashboard
    React.useEffect(() => {
        if (currentUser && userType !== UserType.GUEST) {
            navigate('/dashboard');
        }
    }, [currentUser, userType, navigate]);

    const handleGoogleSignIn = () => {
        setIsLoading(true);

        // Open the main site's auth page in a popup
        const popup = window.open(
            'https://opendev-labs.github.io/auth',
            'opendev_auth',
            'width=480,height=600,top=100,left=100,resizable=yes,scrollbars=yes'
        );

        if (!popup) {
            alert('Popup blocked. Please allow popups for this site and try again.');
            setIsLoading(false);
            return;
        }

        // Poll localStorage for the Firebase auth key (written by main site after sign-in)
        const POLL_INTERVAL = 600;
        const MAX_WAIT = 120_000; // 2 min
        let elapsed = 0;

        const poll = setInterval(() => {
            elapsed += POLL_INTERVAL;

            // Check every known Firebase auth key prefix
            const fbKey = Object.keys(localStorage).find(k => k.startsWith('firebase:authUser:'));
            if (fbKey) {
                try {
                    const fbUser = JSON.parse(localStorage.getItem(fbKey) || '{}');
                    if (fbUser?.email) {
                        clearInterval(poll);
                        popup.close();

                        const bridgedUser = {
                            id: `firebase_${fbUser.email.replace(/[^a-z0-9]/gi, '_')}`,
                            name: fbUser.displayName || fbUser.email,
                            email: fbUser.email,
                            purchaseHistory: [] as any[],
                            wishlist: [] as any[],
                            isVerified: true,
                            profileImageUrl: fbUser.photoURL || '',
                        };
                        setCurrentUser(bridgedUser, UserType.USER);
                        setIsLoading(false);
                        navigate('/dashboard');
                        return;
                    }
                } catch { /* continue polling */ }
            }

            // Timeout or popup closed by user
            if (elapsed >= MAX_WAIT || popup.closed) {
                clearInterval(poll);
                setIsLoading(false);
            }
        }, POLL_INTERVAL);
    };

    const onEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const result = await handleEmailLogin(email.trim(), password.trim());
            if (result.success) {
                navigate('/dashboard');
            } else {
                setErrorMsg(result.message || "Login failed.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setErrorMsg("System error. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative font-sans selection:bg-white/20">

            {/* Background is handled globally by App.tsx to ensure Antigravity consistency */}

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

                {/* Morphic Eye Identity */}
                <div className="mb-10 scale-125 animate-float-delayed">
                    <MorphicEye className="w-24 h-24 border border-white/30 bg-black shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-full" />
                </div>

                <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-[32px] relative overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]">

                    {/* Top Shine */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black tracking-tighter text-white mb-2">{APP_NAME}</h1>
                        <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.2em]">Writing Platform</p>
                    </div>

                    {/* --- TOGGLE TABS --- */}
                    <div className="flex bg-white/5 p-1 rounded-full mb-8 border border-white/5">
                        <button
                            onClick={() => setLoginMode('social')}
                            className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${loginMode === 'social' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Reader
                        </button>
                        <button
                            onClick={() => setLoginMode('email')}
                            className={`flex-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${loginMode === 'email' ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                        >
                            Admin / Writer
                        </button>
                    </div>

                    {/* --- GOOGLE LOGIN (Social Mode) --- */}
                    {loginMode === 'social' && (
                        <div className="animate-fade-in">
                            <div className="mb-6 relative group">
                                {/* Hover Glow Background */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-neutral-700/30 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-700"></div>

                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="relative w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <GoogleIcon />
                                    )}
                                    <span>Continue with Google</span>
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-neutral-500 px-4 leading-relaxed">
                                By continuing, you agree to our Terms of Service and confirm you have read our Privacy Policy.
                            </p>
                        </div>
                    )}

                    {/* --- EMAIL LOGIN (Admin/Writer Mode) --- */}
                    {loginMode === 'email' && (
                        <form onSubmit={onEmailSubmit} className="animate-fade-in space-y-4">
                            <div>
                                {/* Changed type="text" to support username-only logins (e.g. 'opendev-labs') */}
                                <input
                                    type="text"
                                    placeholder="Email or Username"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 placeholder-neutral-600 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#0b0b0b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 placeholder-neutral-600 transition-colors"
                                    required
                                />
                            </div>

                            {errorMsg && (
                                <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20 text-center">
                                    {errorMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? 'Authenticating...' : 'Access Dashboard'}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-[10px] text-neutral-600">Restricted access for Owners & Paid Writers.</p>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <Link to="/" className="text-neutral-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                            Cancel
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[9px] text-neutral-500 font-mono tracking-widest">
                        POWERED BY AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
