
import React, { useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { APP_NAME, ENGINE_NAME } from '../constants';

const { Link, useLocation } = ReactRouterDOM as any;

declare global {
  interface Window {
    anime: any;
  }
}

const Footer: React.FC = () => {
  const location = useLocation();
  const waveRef = useRef<SVGSVGElement>(null);

  // Animation Effect: Linear Flowing Waves
  useEffect(() => {
    // Only run animation if we are rendering the footer (i.e. if the ref exists)
    if (waveRef.current && window.anime) {
        // Clear any existing animations on these targets (optional safety)
        window.anime.remove('.wave-path-1');
        window.anime.remove('.wave-path-2');
        window.anime.remove('.wave-path-3');

        // Wave 1 (Deepest/Back) - Slowest
        window.anime({
            targets: '.wave-path-1',
            translateX: [0, -1440],
            duration: 20000,
            easing: 'linear',
            loop: true
        });

        // Wave 2 (Middle) - Medium Speed
        window.anime({
            targets: '.wave-path-2',
            translateX: [0, -1440],
            duration: 15000,
            easing: 'linear',
            loop: true
        });

        // Wave 3 (Front) - Fastest
        window.anime({
            targets: '.wave-path-3',
            translateX: [0, -1440],
            duration: 8000,
            easing: 'linear',
            loop: true
        });
    }
  }, [location.pathname]); // Re-run if path changes to ensure animation restarts if component re-mounts

  // HIDE FOOTER ON STUDIO PAGE, STANDALONE PREVIEW, DASHBOARD, OR READER PAGE
  if (location.pathname === '/ebook-studio' || location.pathname.startsWith('/site/') || location.pathname === '/dashboard' || location.pathname.startsWith('/read/')) {
      return null;
  }

  return (
    <div className="relative mt-48">
        {/* --- Linear Flowing Wave Separator --- */}
        {/* Height increased to accommodate the wave amplitude */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%] z-0" style={{ height: '200px' }}>
            <svg 
                ref={waveRef}
                className="relative block w-full h-full" 
                viewBox="0 0 1440 320" 
                preserveAspectRatio="none"
            >
                {/* 
                    PATH DATA EXPLANATION:
                    We draw a wave that is 2 cycles wide (2880 units).
                    The viewbox is 1440 units wide.
                    By translating from 0 to -1440, we create a seamless infinite loop.
                    
                    Q = Quadratic Bezier (Control Point, End Point)
                    T = Smooth Quadratic Bezier (Reflects previous control point)
                */}

                {/* Layer 1: Dark Grey (Back) 
                    Shape: Starts oscillating UP. Base Y ~160.
                */}
                <path 
                    className="wave-path-1 fill-[#1a1a1a] opacity-100" 
                    d="M0,160 Q360,240 720,160 T1440,160 T2160,160 T2880,160 V320 H0 Z"
                ></path>
                
                {/* Layer 2: Very Dark Grey (Middle) 
                    Shape: Starts oscillating DOWN (Phase Shift). Base Y ~190.
                */}
                <path 
                    className="wave-path-2 fill-[#0d0d0d] opacity-100" 
                    d="M0,192 Q360,112 720,192 T1440,192 T2160,192 T2880,192 V320 H0 Z"
                ></path>
                
                {/* Layer 3: Solid Black (Front) - Connects to Footer 
                    Shape: Starts oscillating UP but sharper. Base Y ~220.
                */}
                <path 
                    className="wave-path-3 fill-[#000000]" 
                    d="M0,224 Q360,284 720,224 T1440,224 T2160,224 T2880,224 V320 H0 Z"
                ></path>
            </svg>
        </div>

        {/* Footer Content */}
        <footer className="bg-[#000000] text-neutral-500 py-12 relative z-10 border-t-0">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
              <div>
                <h3 className="text-white font-black text-3xl mb-3 tracking-tighter lowercase flex items-center justify-center md:justify-start gap-2">
                    {APP_NAME}
                </h3>
                <p className="font-mono text-sm opacity-60 max-w-xs mx-auto md:mx-0">&copy; {new Date().getFullYear()} All rights reserved.</p>
                
                <div className="mt-6 space-y-2">
                    <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
                        Where Thought Becomes Literature
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 opacity-80 hover:opacity-100 transition-opacity mt-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Neural Engine: {ENGINE_NAME}</span>
                    </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                <Link to="/contact" className="hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest">Contact</Link>
                <Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest">Terms</Link>
                <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest">Privacy</Link>
                <Link to="/refund-policy" className="hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest">Refunds</Link>
                <Link to="/shipping-policy" className="hover:text-white transition-colors duration-300 text-xs font-bold uppercase tracking-widest">Shipping</Link>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default Footer;