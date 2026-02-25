
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
    const { currentUser, userType, upgradeToSeller } = useAppContext();
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
            
            {/* === Background Effects (Matching Login Page) === */}
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
                        {/* Hover Glow */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                                <IconBook className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Reader</h3>
                        </div>
                        
                        <div className="mb-6">
                            <span className="text-4xl font-black text-white">Free</span>
                            <span className="text-neutral-500 ml-2">/ forever</span>
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
                            {[
                                'Read Unlimited Books',
                                'Saved Books List',
                                'Works on All Devices',
                                'Community Reviews',
                                'Personal Library'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <IconCheck className="w-4 h-4 text-google-green flex-shrink-0" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Creator Plan */}
                    <div className="bg-black border border-white/10 p-8 md:p-10 rounded-[32px] relative shadow-2xl overflow-hidden">
                        {/* Top Gradient Highlight */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-google-blue to-transparent opacity-50"></div>
                        
                        <div className="absolute top-6 right-6 px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-glow-white">
                            Recommended
                        </div>

                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                                {/* Updated robust Feather icon usage */}
                                <IconFeather className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Writer</h3>
                        </div>
                        
                        <div className="mb-6 relative z-10">
                            <span className="text-4xl font-black text-white">₹{billingCycle === 'monthly' ? '444' : '4,444'}</span>
                            <span className="text-neutral-500 ml-2">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>

                        <p className="text-neutral-400 text-sm mb-8 min-h-[40px] relative z-10">
                            Write with AI, publish your books, and sell them online.
                        </p>

                        {userType === UserType.SELLER ? (
                             <button 
                                disabled
                                className="w-full py-4 rounded-full bg-green-500/10 text-green-400 font-bold border border-green-500/50 mb-8 cursor-default flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                            >
                                <IconCheck className="w-5 h-5" /> Current Plan
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubscribe}
                                disabled={isProcessing}
                                className="w-full py-4 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-glow-white mb-8 flex items-center justify-center gap-2 relative z-10 uppercase tracking-widest text-xs"
                            >
                                {isProcessing ? 'Processing...' : (
                                    <>
                                        <IconRocket className="w-4 h-4" /> Upgrade to Writer
                                    </>
                                )}
                            </button>
                        )}

                        <div className="space-y-4 relative z-10">
                            {[
                                'Everything in Reader',
                                'Publish Unlimited Books',
                                'Co-Author Assistant',
                                'AI Cover Creator',
                                'Your Own Profile Page',
                                'See Sales Stats',
                                'Keep 70% of Sales',
                                'Priority Support'
                            ].map((feature, i) => (
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

                {/* FAQ / Trust */}
                <div className="mt-20 text-center border-t border-white/10 pt-10">
                    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 text-neutral-400 text-sm">
                        <div className="flex items-center justify-center gap-3">
                            <IconStar className="w-5 h-5 text-yellow-500" />
                            <span>Trusted by 10,000+ Creators</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                             <svg className="w-5 h-5 text-google-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                             <svg className="w-5 h-5 text-google-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            <span>Cancel Anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
