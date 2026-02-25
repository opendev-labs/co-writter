
import React, { useState, useEffect, FormEvent } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { EBook, GeneratedImage, UserType } from '../types';
import AIPricingOptimizer from '../components/AI/AIPricingOptimizer';
import AICoverGenerator from '../components/AI/AICoverGenerator';
import Spinner from '../components/Spinner';
import { IconBook, BORDER_CLASS, IconSparkles, IconUpload, IconWallet, IconRocket, IconArrowLeft, IconCheck } from '../constants';

const { useParams, useNavigate } = ReactRouterDOM as any;

// Dashboard-aligned input styles
const commonInputClasses = `w-full bg-[#0b0b0b] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-all duration-200 placeholder-neutral-600 font-sans`;
const labelClasses = `block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2`;

const EditEBookPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const appContext = useAppContext();
  const { allBooks, updateEBook, currentUser, userType } = appContext;

  const [bookToEdit, setBookToEdit] = useState<EBook | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [monetizationType, setMonetizationType] = useState<'paid' | 'free'>('paid');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [aiGeneratedCoverData, setAiGeneratedCoverData] = useState<GeneratedImage | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      navigate('/dashboard'); 
      return;
    }
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
      if (currentUser && userType === UserType.SELLER && book.sellerId === currentUser.id) {
        setBookToEdit(book);
        setTitle(book.title);
        setAuthor(book.author);
        setDescription(book.description);
        setGenre(book.genre);
        setPrice(book.price.toString());
        setMonetizationType(book.price === 0 ? 'free' : 'paid');
        setCoverImageUrl(book.coverImageUrl); 
      } else {
        setFormError("You do not have permission to edit this eBook.");
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    } else {
      setFormError("eBook not found.");
      setTimeout(() => navigate('/dashboard'), 3000);
    }
    setIsLoading(false);
  }, [bookId, allBooks, navigate, currentUser, userType]);

  const handlePriceSuggested = (suggestedPrice: string) => {
    if (monetizationType === 'paid') {
        setPrice(suggestedPrice);
    }
  };

  const handleCoverGenerated = (imageData: GeneratedImage) => {
    setAiGeneratedCoverData(imageData);
    setCoverImageUrl(`data:image/jpeg;base64,${imageData.imageBytes}`); 
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!bookToEdit) {
      setFormError("No book selected for editing.");
      return;
    }
    if (!title || !author || !description || !genre) {
      setFormError("Please fill in all required fields.");
      return;
    }

    let finalPrice = 0;
    if (monetizationType === 'paid') {
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setFormError("Please enter a valid price.");
            return;
        }
        finalPrice = parseFloat(price);
    } else {
        finalPrice = 0;
    }

    setIsSaving(true);
    
    const finalCoverImageUrl = aiGeneratedCoverData 
      ? `data:image/jpeg;base64,${aiGeneratedCoverData.imageBytes}`
      : coverImageUrl;

    const updatedBookData: EBook = {
      ...bookToEdit,
      title,
      author,
      description,
      genre,
      price: finalPrice,
      coverImageUrl: finalCoverImageUrl,
      publicationDate: bookToEdit.publicationDate, 
    };

    updateEBook(updatedBookData);
    setIsSaving(false);
    navigate('/dashboard'); 
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
            <Spinner size="lg" color="text-white" />
        </div>
    );
  }

  if (formError && !bookToEdit) { 
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center text-center px-6">
        <IconBook className="w-16 h-16 text-neutral-700 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-neutral-500 mb-8">{formError}</p>
        <button 
            onClick={() => navigate('/dashboard')}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-neutral-200 transition-colors"
        >
            Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!bookToEdit) return null;

  const bookDetailsForAI = { title, genre, description };

  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-24 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
            >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <IconArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Back</span>
            </button>
            <h1 className="text-xl font-normal text-white flex items-center gap-3">
                 Edit <span className="text-neutral-500">/</span> {bookToEdit.title}
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e1e1e] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl space-y-8 animate-slide-up">
            
            <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-8">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                    <IconSparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-normal text-white">Book Configuration</h2>
                    <p className="text-neutral-500 text-sm">Update metadata, pricing, and visual assets.</p>
                </div>
            </div>
            
            {formError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                {formError}
            </div>
            )}

            {/* Main Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label htmlFor="title" className={labelClasses}>Book Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={commonInputClasses}/>
                </div>

                <div>
                    <label htmlFor="author" className={labelClasses}>Author Name</label>
                    <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} required className={commonInputClasses}/>
                </div>

                <div>
                    <label htmlFor="genre" className={labelClasses}>Genre</label>
                    <input type="text" id="genre" value={genre} onChange={e => setGenre(e.target.value)} required placeholder="e.g. Sci-Fi" className={commonInputClasses}/>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="description" className={labelClasses}>Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className={`${commonInputClasses} min-h-[120px] resize-none`}/>
                </div>
            </div>

            {/* Monetization Section */}
            <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-2xl">
                 <h3 className="text-lg font-medium text-white mb-6">Monetization Strategy</h3>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                     <button 
                        type="button"
                        onClick={() => setMonetizationType('paid')}
                        className={`p-5 rounded-2xl border text-left transition-all group ${monetizationType === 'paid' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                     >
                         <div className="flex items-center justify-between mb-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${monetizationType === 'paid' ? 'bg-black text-white' : 'bg-white/10 text-neutral-400'}`}>
                                 <IconWallet className="w-4 h-4" />
                             </div>
                             {monetizationType === 'paid' && <IconCheck className="w-5 h-5 text-black" />}
                         </div>
                         <h4 className={`font-bold mb-1 ${monetizationType === 'paid' ? 'text-black' : 'text-white'}`}>Premium Asset</h4>
                         <p className={`text-xs ${monetizationType === 'paid' ? 'text-neutral-600' : 'text-neutral-500'}`}>Set a price and earn royalties.</p>
                     </button>

                     <button 
                        type="button"
                        onClick={() => setMonetizationType('free')}
                        className={`p-5 rounded-2xl border text-left transition-all group ${monetizationType === 'free' ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 hover:border-white/20'}`}
                     >
                         <div className="flex items-center justify-between mb-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${monetizationType === 'free' ? 'bg-black text-white' : 'bg-white/10 text-neutral-400'}`}>
                                 <IconRocket className="w-4 h-4" />
                             </div>
                             {monetizationType === 'free' && <IconCheck className="w-5 h-5 text-black" />}
                         </div>
                         <h4 className={`font-bold mb-1 ${monetizationType === 'free' ? 'text-black' : 'text-white'}`}>Growth Magnet</h4>
                         <p className={`text-xs ${monetizationType === 'free' ? 'text-neutral-600' : 'text-neutral-500'}`}>Free distribution for readers.</p>
                     </button>
                 </div>

                 {monetizationType === 'paid' && (
                    <div className="animate-fade-in space-y-6">
                        <div>
                            <label htmlFor="price" className={labelClasses}>List Price (INR)</label>
                            <input 
                                type="number" 
                                id="price" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                step="0.01" 
                                min="1" 
                                required={monetizationType === 'paid'}
                                className={commonInputClasses}
                                placeholder="499"
                            />
                        </div>
                        <AIPricingOptimizer bookDetails={bookDetailsForAI} onPriceSuggested={handlePriceSuggested} />
                    </div>
                 )}
            </div>

            {/* Visual Assets Section */}
            <div className="p-6 bg-[#0b0b0b] border border-white/5 rounded-2xl">
                <h3 className="text-lg font-medium text-white mb-6">Cover Art</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                     <div className="w-full md:w-1/3 shrink-0">
                         <div className="aspect-[3/4] bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/10 relative group">
                            {coverImageUrl ? (
                                <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                                    <IconBook className="w-12 h-12 mb-2 opacity-50" />
                                    <span className="text-xs uppercase tracking-widest">No Cover</span>
                                </div>
                            )}
                         </div>
                         <div className="mt-4">
                            <label htmlFor="manualCover" className={labelClasses}>Manual URL</label>
                            <input 
                                type="url"
                                id="manualCover" 
                                value={aiGeneratedCoverData ? '' : coverImageUrl}
                                onChange={e => {
                                    setCoverImageUrl(e.target.value);
                                    setAiGeneratedCoverData(null);
                                }}
                                className={commonInputClasses}
                                placeholder="https://..."
                            />
                         </div>
                     </div>
                     
                     <div className="w-full md:w-2/3">
                         <AICoverGenerator 
                            onCoverGenerated={handleCoverGenerated}
                            currentTitle={title}
                            currentAuthor={author}
                        />
                     </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 rounded-full border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-glow-white disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? <Spinner size="sm" color="text-black" /> : <><IconCheck className="w-4 h-4"/> Save Changes</>}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default EditEBookPage;
