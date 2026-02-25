
import React from 'react';
import { EBook } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { IconShoppingCart, IconBook } from '../constants'; 
import * as ReactRouterDOM from 'react-router-dom';

const { useNavigate } = ReactRouterDOM as any;

interface BookCardProps {
  book: EBook;
  onViewDetails?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewDetails }) => {
  const { addToCart } = useAppContext();
  const navigate = useNavigate();

  const isFree = book.price === 0;

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isFree) {
        navigate(`/read/${book.id}`);
    } else {
        addToCart(book);
    }
  };
  
  const handleCardClick = () => {
    if (onViewDetails) {
        onViewDetails(book.id);
    }
  };

  return (
    <div 
      className="group relative bg-black/40 backdrop-blur-sm rounded-[20px] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 ease-obsidian cursor-pointer flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] will-change-transform"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#050505] border-b border-white/5">
        <img 
            src={book.coverImageUrl || 'https://picsum.photos/400/600'} 
            alt={`Cover of ${book.title}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-obsidian opacity-90 group-hover:opacity-100 will-change-transform"
            loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isFree && (
                <div className="bg-white text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-lg">
                    Free
                </div>
            )}
        </div>
      </div>
    
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-full">{book.genre}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-1 group-hover:text-neutral-200 transition-colors" title={book.title}>
                {book.title}
            </h3>
            <p className="text-xs text-neutral-500 uppercase tracking-widest line-clamp-1">{book.author}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-lg font-light text-white font-mono">
                {isFree ? 'FREE' : `₹${book.price.toFixed(0)}`}
            </span>
            
            <button 
                onClick={handleAction}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ease-obsidian hover:scale-105 active:scale-95 ${
                    isFree 
                    ? 'bg-white/10 text-white hover:bg-white hover:text-black border border-white/20' 
                    : 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}
            >
                {isFree ? (
                    <>Read <IconBook className="w-3 h-3" /></>
                ) : (
                    <>Add <IconShoppingCart className="w-3 h-3" /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
