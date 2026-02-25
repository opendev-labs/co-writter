

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { IconShoppingCart, IconTrash, IconRazorpay, BORDER_CLASS, RAZORPAY_KEY_ID, IconRocket, IconStore } from '../constants';
import * as ReactRouterDOM from 'react-router-dom';
import { User, Seller } from '../types'; 
import MorphicEye from '../components/MorphicEye';

const { useNavigate } = ReactRouterDOM as any;

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Enforce Login
  const isLoggedIn = currentUser && currentUser.id !== 'guest';

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.07; 
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-checkout-js')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      }
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!isLoggedIn) {
        navigate('/login'); 
        return;
    }
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded || !window.Razorpay) {
      alert("Payment Gateway failed to load. Please check your connection.");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    const options = {
      key: RAZORPAY_KEY_ID, 
      amount: Math.round(totalAmount * 100), 
      currency: "INR", 
      name: "Co-Writter Inc.",
      description: "Book Purchase",
      image: "https://raw.githubusercontent.com/atherosai/OpenStore.io/main/vite.svg", 
      handler: function (response: any) {
        console.log("Razorpay Response:", response);
        alert(`Payment Successful! Transaction ID: ${response.razorpay_payment_id}`);
        clearCart();
        navigate('/dashboard'); 
        setIsProcessing(false);
      },
      prefill: {
        name: currentUser?.name || "",
        email: (currentUser as User | Seller)?.email || "",
        contact: "" 
      },
      readonly: {
        email: true,
        name: true
      },
      notes: {
        items: cart.map(item => `${item.title} (Qty: ${item.quantity})`).join(', '),
        userId: currentUser?.id,
      },
      theme: {
        color: "#000000", 
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
        console.error("Error initializing Razorpay:", error);
        alert("Could not initiate payment.");
        setIsProcessing(false);
    }
  };

  // --- EMPTY STATE: VOID DETECTED ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
        {/* Localized Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center animate-slide-up">
            <div className="mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 hover:opacity-100 hover:scale-110">
                 <MorphicEye className="w-32 h-32 bg-black border border-white/10 rounded-full" isActive={false} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Cart is Empty</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-10">You haven't added any books yet.</p>
            
            <button
                onClick={() => navigate('/store')}
                className="group relative px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-2">
                    <IconStore className="w-4 h-4" /> Browse Books
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-32 pb-20">
      
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-slide-down">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-google-green rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Secure Checkout</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Your Cart</h1>
        </div>
        <p className="text-neutral-400 text-sm font-mono text-right hidden md:block">
            Order ID: {Math.random().toString(36).substring(2, 9).toUpperCase()}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CART ITEMS --- */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div 
                key={item.id} 
                className={`group flex flex-col sm:flex-row items-center gap-6 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-[24px] hover:border-white/30 hover:bg-white/5 transition-all duration-300 animate-slide-up-stagger delay-${idx * 100}`}
            >
              {/* Cover */}
              <div className="shrink-0 relative">
                  <img 
                    src={item.coverImageUrl} 
                    alt={item.title} 
                    className="w-24 h-36 object-cover rounded-lg shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 group-hover:ring-white/30"></div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/5 text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
                          {item.genre}
                      </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 leading-tight">{item.title}</h3>
                  <p className="text-xs text-neutral-500 font-mono uppercase tracking-wide mb-4">By {item.author}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                      >
                        <IconTrash className="w-3 h-3" /> Remove
                      </button>
                  </div>
              </div>

              {/* Price */}
              <div className="text-right">
                  <p className="text-3xl font-light text-white tracking-tighter">₹{(item.price * item.quantity).toFixed(0)}</p>
                  <p className="text-[10px] text-neutral-600 font-mono uppercase mt-1">Price</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- RIGHT: PAYMENT HUD --- */}
        <div className="lg:col-span-1 h-fit sticky top-24 animate-slide-up-stagger delay-300">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                    Summary
                </h2>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Subtotal</span>
                        <span className="text-white font-mono">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Tax</span>
                        <span className="text-white font-mono">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-px bg-white/10 my-2"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-4xl font-black text-white tracking-tighter">₹{totalAmount.toFixed(0)}</span>
                    </div>
                </div>

                {isLoggedIn ? (
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? 'Processing...' : (
                            <>
                                <IconRazorpay className="w-4 h-4" /> Pay Now
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all"
                    >
                        Login to Purchase
                    </button>
                )}

                <div className="mt-6 flex items-center justify-center gap-2 text-[9px] text-neutral-600 font-mono uppercase tracking-widest">
                    <IconRocket className="w-3 h-3" /> Instant Download
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
