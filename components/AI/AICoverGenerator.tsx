
import React, { useState } from 'react';
import { generateBookCover } from '../../services/geminiService';
import Spinner from '../Spinner';
import { GeneratedImage } from '../../types';
import { IconChevronDown, IconCheck } from '../../constants';

interface AICoverGeneratorProps {
  onCoverGenerated: (imageData: GeneratedImage) => void;
  currentTitle?: string;
  currentAuthor?: string;
}

const COVER_STYLES = [
    'Cinematic', 'Minimalist', 'Fantasy', 'Sci-Fi', 
    'Cyberpunk', 'Oil Painting', 'Watercolor', '3D Render', 
    'Photorealistic', 'Abstract', 'Noir', 'Vintage'
];

const AICoverGenerator: React.FC<AICoverGeneratorProps> = ({ onCoverGenerated, currentTitle, currentAuthor }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('Cinematic');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCover = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside a form
    if (!prompt.trim()) {
        setError("Please describe your vision.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateBookCover(prompt, style, currentTitle, currentAuthor);
      if ('error' in result) {
        setError(result.error);
        setGeneratedImage(null);
      } else {
        setGeneratedImage(result);
        onCoverGenerated(result);
      }
    } catch (err) {
      setError('Generation failed. Please try again.');
      setGeneratedImage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClasses = `w-full bg-[#0b0b0b] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all duration-200 placeholder-neutral-600 font-sans`;
  const labelClasses = `block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2`;

  return (
    <div className="bg-[#151515] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="mb-6">
         <h4 className="text-base font-bold text-white">AI Cover Designer</h4>
         <p className="text-xs text-neutral-500">Generate professional cover art instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Style Selector */}
          <div>
            <label className={labelClasses}>Art Direction</label>
            <div className="relative">
                <select 
                    value={style} 
                    onChange={(e) => setStyle(e.target.value)}
                    className={`${commonInputClasses} appearance-none cursor-pointer`}
                >
                    {COVER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <IconChevronDown className="w-4 h-4" />
                </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Visual Concept</label>
            <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A lone astronaut..."
                className={commonInputClasses}
            />
          </div>
      </div>

      <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateCover}
            disabled={isLoading || !prompt.trim()}
            className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 min-w-[140px]"
          >
            {isLoading ? <Spinner size="sm" color="text-black" /> : 'Generate Art'}
          </button>
      </div>
      
      {error && <p className="text-red-400 mt-4 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
      
      {generatedImage && !error && (
        <div className="mt-8 pt-8 border-t border-white/5 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-32 h-48 rounded-lg overflow-hidden shadow-2xl border border-white/10 group">
                   <img 
                      src={`data:image/jpeg;base64,${generatedImage.imageBytes}`} 
                      alt="Generated Cover" 
                      className="w-full h-full object-cover"
                    />
              </div>
              <div className="flex-1 text-center md:text-left">
                  <h5 className="text-sm font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                      <IconCheck className="w-4 h-4 text-green-500" /> Cover Applied
                  </h5>
                  <p className="text-xs text-neutral-500 mb-1">The image has been automatically attached to your book.</p>
                  {generatedImage.revisedPrompt && (
                      <p className="text-[10px] text-neutral-600 italic mt-2">"{generatedImage.revisedPrompt.substring(0, 80)}..."</p>
                  )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoverGenerator;
