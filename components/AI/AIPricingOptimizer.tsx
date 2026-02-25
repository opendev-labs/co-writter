
import React, { useState } from 'react';
import { suggestBookPrice } from '../../services/geminiService';
import Spinner from '../Spinner';
import { EBook } from '../../types';
import { IconTrendingUp, IconCheck, IconSparkles } from '../../constants';

interface AIPricingOptimizerProps {
  bookDetails: Pick<EBook, 'title' | 'genre' | 'description'>;
  onPriceSuggested: (price: string) => void;
}

const AIPricingOptimizer: React.FC<AIPricingOptimizerProps> = ({ bookDetails, onPriceSuggested }) => {
  const [suggestedPrice, setSuggestedPrice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestPrice = async () => {
    if (!bookDetails.title) {
        setError("Enter a title first.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const price = await suggestBookPrice(bookDetails);
      if (price.match(/^\d+(\.\d{1,2})?$/)) { 
        setSuggestedPrice(price); 
        onPriceSuggested(price); 
      } else {
        setError('Could not calculate.');
      }
    } catch (err) {
      setError('Service unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] border border-white/5 rounded-2xl p-5 mt-4 flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-900/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-shadow duration-500">
                <IconTrendingUp className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-white shadow-sm">
                AI <IconSparkles className="w-2 h-2" />
            </div>
        </div>
        <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Smart Pricing Model
            </h4>
            <p className="text-[10px] text-neutral-500 max-w-[200px]">Analyze market trends & genre data to predict the optimal revenue point.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
          {suggestedPrice && (
               <div className="flex flex-col items-end mr-2 animate-fade-in">
                   <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Target Price</span>
                   <div className="flex items-center gap-2 text-emerald-400">
                        <span className="text-xl font-black tracking-tighter">₹{parseFloat(suggestedPrice).toFixed(0)}</span>
                        <IconCheck className="w-4 h-4 bg-emerald-500/20 rounded-full p-0.5" />
                   </div>
               </div>
          )}
          <button
            onClick={handleSuggestPrice}
            disabled={isLoading}
            className="px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 border border-transparent hover:border-white/50 transition-all font-bold text-[10px] uppercase tracking-widest disabled:opacity-50 shadow-glow-white hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? <Spinner size="sm" color="text-black"/> : 'Optimize'}
          </button>
      </div>
      {error && <span className="text-red-400 text-xs font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">{error}</span>}
    </div>
  );
};

export default AIPricingOptimizer;
