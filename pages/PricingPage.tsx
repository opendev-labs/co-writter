
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { IconCheck, IconSparkles, RAZORPAY_KEY_ID, APP_NAME, IconStar, IconBook, IconRocket, IconFeather } from '../constants';
import { UserType } from '../types';

const { useNavigate } = ReactRouterDOM as any;

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PricingPage: React.FC = () => {
    const { currentUser, userType, upgradeToSeller, setCurrentUser } = useAppContext();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscribe = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Load Razorpay Script
        const loadRazorpay = () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert('Could not load payment gateway. Please try again.');
            return;
        }

        setIsProcessing(true);

        const amount = billingCycle === 'monthly' ? 444 : 4444;
        
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100, // Amount in paise
            currency: "INR",
            name: "My Ebook Store",
            description: `Pro Creator Subscription (${billingCycle})`,
            image: "https://raw.githubusercontent.com/atherosai/OpenStore.io/main/vite.svg",
            handler: function (response: any) {
                console.log("Subscription Successful", response);
                upgradeToSeller();
                alert(`Welcome to the Writer Dashboard! Payment ID: ${response.razorpay_payment_id}`);
                navigate('/dashboard');
                setIsProcessing(false);
            },
            prefill: {
                name: currentUser.name,
                email: currentUser.email,
            },
            theme: {
                color: "#000000",
            },
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            rzp.open();
        } catch (error) {
            console.error("Payment initialization failed", error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative bg-black selection:bg-white/20 font-sans">
            
            {/* === Background Effects === */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 pt-24 pb-20 animate-fade-in max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10 tracking-tighter">
                        Choose a Plan
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto relative z-10">
                        Start for free or upgrade to sell your own books and use AI tools.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center mt-8 relative z-10">
                        <div className="bg-white/5 p-1 rounded-full border border-white/10 flex relative">
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-black shadow-glow-white' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-white text-black shadow-glow-white' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Yearly <span className="text-[9px] bg-google-green text-black px-1.5 py-0.5 rounded ml-1">-15%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    
                    {/* 1. Reader Plan */}
                    <div className="bg-black border border-white/10 p-8 md:p-10 rounded-[32px] relative group shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                                <IconBook className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Reader</h3>
                        </div>
                        
                        <div className="mb-6">
                            <span className="text-4xl font-black text-white">Free</span>
                        </div>

                        <p className="text-neutral-400 text-sm mb-8 min-h-[40px]">
                            Read free books and build your personal collection.
                        </p>

                        <button 
                            onClick={() => navigate('/store')}
                            className="w-full py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors mb-8 uppercase tracking-widest text-xs"
                        >
                            Browse Books
                        </button>

                        <div className="space-y-4">
                            {['Read Unlimited Books', 'Saved Books List', 'Works on All Devices'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <IconCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Creator Plan */}
                    <div className="bg-black border border-white/10 p-8 md:p-10 rounded-[32px] relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                        
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                                <IconFeather className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Writer</h3>
                        </div>
                        
                        <div className="mb-6 relative z-10">
                            <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? '444' : '4,444'}</span>
                        </div>

                        <p className="text-neutral-400 text-sm mb-8 min-h-[40px] relative z-10">
                            Write with AI, publish your books, and sell them online.
                        </p>

                        {userType === UserType.SELLER ? (
                             <button disabled className="w-full py-4 rounded-full bg-green-500/10 text-green-400 font-bold border border-green-500/50 mb-8 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                <IconCheck className="w-5 h-5" /> Current Plan
                            </button>
                        ) : (
                            <div className="flex flex-col gap-2 mb-8 relative z-10">
                                <button 
                                    onClick={handleSubscribe}
                                    disabled={isProcessing}
                                    className="w-full py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-glow-white flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                >
                                    {isProcessing ? 'Processing...' : <><IconRocket className="w-4 h-4" /> Upgrade to Writer</>}
                                </button>
                                
                                {import.meta.env.DEV && (
                                    <button 
                                        onClick={() => {
                                            // Ensure a user exists first
                                            if (!currentUser) {
                                                setCurrentUser({
                                                    id: 'dev-user',
                                                    name: 'Dev Author',
                                                    email: 'dev@co-writter.io',
                                                    isVerified: true,
                                                    profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev'
                                                }, UserType.USER);
                                            }
                                            // Then upgrade
                                            setTimeout(() => {
                                                upgradeToSeller();
                                                alert("DEV MODE: Upgraded to Writer successfully!");
                                                navigate('/dashboard');
                                            }, 100);
                                        }}
                                        className="w-full py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/10 transition-colors"
                                    >
                                        [DEV] Instant Upgrade
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="space-y-4 relative z-10">
                            {['Everything in Reader', 'Publish Unlimited Books', 'Co-Author AI', 'Keep 70% of Sales'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                                    <div className="p-0.5 bg-white rounded-full">
                                        <IconCheck className="w-3 h-3 text-black flex-shrink-0" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
