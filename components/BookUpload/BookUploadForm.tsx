
import React, { useState } from 'react';
import { EBook, GeneratedImage, UserType } from '../../types';
import AIPricingOptimizer from '../AI/AIPricingOptimizer';
import AICoverGenerator from '../AI/AICoverGenerator';
import { IconUpload, IconWallet, IconRocket, IconSparkles, IconCheck, IconBook } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';
import { analyzePdfContent } from '../../services/geminiService';
import Spinner from '../Spinner';

interface BookUploadFormProps {
  onBookUploaded: (book: EBook) => void; 
}

const inputBaseClasses = `w-full bg-[#0b0b0b] border border-white/10 rounded-xl p-4 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-all duration-200 font-sans`;
const labelClasses = `block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2`;

const BookUploadForm: React.FC<BookUploadFormProps> = ({ onBookUploaded }) => {
  const { currentUser, userType } = useAppContext();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  
  const [monetizationType, setMonetizationType] = useState<'paid' | 'free'>('paid');
  const [price, setPrice] = useState('');
  
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);

  const [aiGeneratedCoverData, setAiGeneratedCoverData] = useState<GeneratedImage | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const performPdfAnalysis = async (selectedFile: File) => {
      setIsAnalyzingPdf(true);
      try {
          const reader = new FileReader();
          reader.onload = async () => {
              const base64Data = reader.result as string;
              const analysis = await analyzePdfContent(base64Data);
              
              if (analysis) {
                  if (analysis.title) setTitle(analysis.title);
                  if (analysis.author) setAuthor(analysis.author);
                  if (analysis.description) setDescription(analysis.description);
                  if (analysis.genre) setGenre(analysis.genre);
              }
              setIsAnalyzingPdf(false);
          };
          reader.onerror = () => {
              setFormError("Error reading file.");
              setIsAnalyzingPdf(false);
          };
          reader.readAsDataURL(selectedFile);
      } catch (err) {
          console.error(err);
          setFormError("Failed to analyze PDF.");
          setIsAnalyzingPdf(false);
      }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files ? e.target.files[0] : null;
      setFile(selectedFile);
      setFormError(null);

      if (selectedFile && selectedFile.type === 'application/pdf') {
          await performPdfAnalysis(selectedFile);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!title || !author || !description || !genre) {
        setFormError("Missing required fields.");
        return;
    }

    let finalPrice = 0;
    if (monetizationType === 'paid') {
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setFormError("Invalid Price.");
            return;
        }
        finalPrice = parseFloat(price);
    }

    setIsProcessingFile(true);

    const currentSellerId = (currentUser && userType === UserType.SELLER) ? currentUser.id : 'unknown_seller_id';

    let pdfDataUrl = undefined;
    if (file) {
        try {
            pdfDataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        } catch (err) {
            setFormError("Failed to process file.");
            setIsProcessingFile(false);
            return;
        }
    }

    const placeholderPages = !pdfDataUrl ? [
        { id: '1', title: 'Chapter 1', pageNumber: 1, content: `Welcome to ${title}.\n\nPlaceholder content.` }
    ] : [];

    const newBook: EBook = {
      id: `book-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
      title,
      author,
      description,
      genre,
      price: finalPrice,
      coverImageUrl: aiGeneratedCoverData ? `data:image/jpeg;base64,${aiGeneratedCoverData.imageBytes}` : (coverImageUrl || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/600`),
      sellerId: currentSellerId, 
      publicationDate: new Date().toISOString().split('T')[0],
      pages: placeholderPages,
      pdfUrl: pdfDataUrl 
    };

    onBookUploaded(newBook);
    
    setTitle(''); setAuthor(''); setDescription(''); setGenre(''); setPrice(''); setCoverImageUrl(''); setFile(null); setAiGeneratedCoverData(null);
    setIsProcessingFile(false);
  };
  
  const handlePriceSuggested = (suggestedPrice: string) => {
    if (monetizationType === 'paid') setPrice(suggestedPrice);
  };

  const handleCoverGenerated = (imageData: GeneratedImage) => {
    setAiGeneratedCoverData(imageData);
    setCoverImageUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-white/5 p-8 md:p-10 shadow-2xl relative overflow-hidden rounded-[32px] animate-fade-in">
      
      <div className="relative z-10 mb-8 border-b border-white/5 pb-8">
          <h2 className="text-3xl font-normal text-white mb-2">Publish New Book</h2>
          <p className="text-neutral-400 text-sm">Upload a PDF or start a fresh manuscript.</p>
      </div>
          
      {formError && (
        <div className="p-4 mb-8 text-red-400 bg-red-900/10 border border-red-500/20 text-sm font-medium rounded-xl flex items-center gap-2">
           <IconCheck className="w-4 h-4 text-red-500" />
           {formError}
        </div>
      )}

      {/* PDF Upload Zone */}
      <div className={`relative h-48 border border-dashed transition-all duration-300 mb-10 flex flex-col items-center justify-center gap-4 group rounded-3xl ${isAnalyzingPdf ? 'bg-white/5 border-white/30' : 'bg-[#0b0b0b] border-white/10 hover:border-white/30'}`}>
        
        {isAnalyzingPdf ? (
            <div className="flex flex-col items-center">
                <Spinner size="md" color="text-white" />
                <p className="mt-4 text-white font-bold text-xs uppercase tracking-widest animate-pulse">Analyzing Content...</p>
            </div>
        ) : (
            <label htmlFor="ebookFile" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                <div className="w-12 h-12 bg-[#1e1e1e] border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform rounded-full shadow-lg">
                    <IconUpload className="w-5 h-5 text-white"/>
                </div>
                <span className="text-sm font-bold text-white mb-1">
                    {file ? file.name : "Upload PDF Document"}
                </span>
                <span className="text-xs text-neutral-500">
                    {file ? "Click to change file" : "Drag & drop or click to browse"}
                </span>
                <input type="file" id="ebookFile" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            </label>
        )}
        
        {file && !isAnalyzingPdf && (
            <button type="button" onClick={() => performPdfAnalysis(file)} className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-1 bg-[#1e1e1e] px-3 py-1.5 rounded-full border border-white/10">
                <IconSparkles className="w-3 h-3" /> Re-Analyze
            </button>
        )}
      </div>

      <div className={`space-y-8 ${isAnalyzingPdf ? 'opacity-50 pointer-events-none blur-sm' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="title" className={labelClasses}>Book Title</label>
                <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputBaseClasses} placeholder="Enter Title..."/>
             </div>
             <div>
                <label htmlFor="author" className={labelClasses}>Author</label>
                <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} required className={inputBaseClasses} placeholder="Enter Author..."/>
             </div>
          </div>

          <div>
             <label htmlFor="description" className={labelClasses}>Description</label>
             <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className={`${inputBaseClasses} min-h-[120px] resize-none`}/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label htmlFor="genre" className={labelClasses}>Genre</label>
                <input type="text" id="genre" value={genre} onChange={e => setGenre(e.target.value)} required className={inputBaseClasses} placeholder="Sci-Fi, Thriller..."/>
             </div>
             
             {/* Monetization */}
             <div>
                <label className={labelClasses}>Monetization</label>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setMonetizationType('paid')} className={`p-4 border text-left transition-all rounded-xl relative overflow-hidden group ${monetizationType === 'paid' ? 'bg-white text-black border-white' : 'bg-[#0b0b0b] text-neutral-400 border-white/10 hover:border-white/20'}`}>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                             <IconWallet className={`w-5 h-5 ${monetizationType === 'paid' ? 'text-black' : 'text-neutral-500'}`}/>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
                        </div>
                    </button>
                    <button type="button" onClick={() => setMonetizationType('free')} className={`p-4 border text-left transition-all rounded-xl relative overflow-hidden group ${monetizationType === 'free' ? 'bg-white text-black border-white' : 'bg-[#0b0b0b] text-neutral-400 border-white/10 hover:border-white/20'}`}>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                             <IconRocket className={`w-5 h-5 ${monetizationType === 'free' ? 'text-black' : 'text-neutral-500'}`}/>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Free</span>
                        </div>
                    </button>
                </div>
             </div>
          </div>

          {monetizationType === 'paid' && (
              <div className="animate-fade-in space-y-6 bg-[#0b0b0b] p-6 rounded-2xl border border-white/5">
                  <div>
                    <label htmlFor="price" className={labelClasses}>List Price (₹)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className={inputBaseClasses} placeholder="499"/>
                  </div>
                  <AIPricingOptimizer bookDetails={{ title, genre, description }} onPriceSuggested={handlePriceSuggested} />
              </div>
          )}
          
          <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-2xl">
              <AICoverGenerator onCoverGenerated={handleCoverGenerated} currentTitle={title} currentAuthor={author} />
               
              {aiGeneratedCoverData && (
                <div className="mt-6 p-4 bg-white/5 border border-white/10 flex items-center gap-4 rounded-xl">
                    <img src={`data:image/jpeg;base64,${aiGeneratedCoverData.imageBytes}`} alt="AI Cover" className="w-12 h-16 object-cover bg-black rounded" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><IconCheck className="w-3 h-3 text-green-500"/> Cover Attached</span>
                </div>
              )}
              
              {!aiGeneratedCoverData && (
                <div className="mt-6">
                    <label className={labelClasses}>Manual Cover URL</label>
                    <input type="url" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} className={inputBaseClasses} placeholder="https://..."/>
                </div>
              )}
          </div>

          <div className="pt-4 flex justify-end">
              <button type="submit" disabled={isProcessingFile || isAnalyzingPdf}
                      className="px-10 py-4 bg-white text-black font-bold hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 rounded-full shadow-glow-white hover:scale-105 active:scale-95">
                {isProcessingFile ? (
                    <>Publishing...</>
                ) : (
                    <><IconUpload className="w-4 h-4" /> Publish to Store</>
                )}
              </button>
          </div>
      </div>
    </form>
  );
};

export default BookUploadForm;
