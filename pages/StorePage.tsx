
import React, { useState, useMemo } from 'react';
import BookCard from '../components/BookCard';
import { EBook } from '../types';
import { IconShoppingCart, IconSearch, IconBook, IconStar } from '../constants';
import Modal from '../components/Modal'; 
import CustomDropdown, { DropdownOption } from '../components/CustomDropdown';
import { useAppContext } from '../contexts/AppContext';
import * as ReactRouterDOM from 'react-router-dom';

const { useNavigate } = ReactRouterDOM as any;

const StorePage: React.FC = () => {
  const { addToCart, allBooks } = useAppContext(); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [sortBy, setSortBy] = useState('publicationDate'); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<EBook | null>(null);

  const genres = useMemo(() => ['All', ...new Set(allBooks.map(book => book.genre))], [allBooks]);

  const genreOptions: DropdownOption[] = genres.map(g => ({ label: g === 'All' ? 'All Genres' : g, value: g }));
  
  const priceOptions: DropdownOption[] = [
      { label: 'All Prices', value: 'All' },
      { label: 'Free Only', value: 'Free' },
      { label: 'Paid Only', value: 'Paid' },
  ];

  const sortOptions: DropdownOption[] = [
      { label: 'Newest First', value: 'publicationDate' },
      { label: 'Title (A-Z)', value: 'title' },
      { label: 'Price (Low-High)', value: 'price' },
  ];

  const filteredAndSortedBooks = useMemo(() => {
    let books = allBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGenre !== 'All') {
      books = books.filter(book => book.genre === selectedGenre);
    }
    
    if (selectedPriceFilter === 'Free') {
        books = books.filter(book => book.price === 0);
    } else if (selectedPriceFilter === 'Paid') {
        books = books.filter(book => book.price > 0);
    }

    return books.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'publicationDate') {
        return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      }
      return 0;
    });
  }, [searchTerm, selectedGenre, selectedPriceFilter, sortBy, allBooks]);

  const featuredBook = useMemo(() => {
      return allBooks.find(b => b.title.includes("Manual")) || allBooks.find(b => b.price > 0) || allBooks[0];
  }, [allBooks]);

  const handleViewDetails = (bookId: string) => {
    const book = allBooks.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setIsModalOpen(true);
    }
  };

  const handleModalAction = () => {
    if (selectedBook) {
        if (selectedBook.price === 0) {
            navigate(`/read/${selectedBook.id}`);
        } else {
            addToCart(selectedBook);
        }
        setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 pt-24 pb-safe md:pb-24 overflow-x-hidden">
      
      {/* Featured Hero */}
      {featuredBook && !searchTerm && selectedGenre === 'All' && (
        <div className="relative w-full rounded-[32px] overflow-hidden mb-12 md:mb-16 group border border-white/10 shadow-2xl animate-fade-in flex flex-col md:block h-auto md:h-[500px]">
             <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105"
                style={{backgroundImage: `url(${featuredBook.coverImageUrl})`}}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-r md:from-black md:via-black/80 md:to-transparent"></div>
             
             <div className="relative z-10 p-8 md:p-16 flex flex-col justify-end md:justify-center min-h-[400px] md:h-full max-w-2xl">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 w-fit mb-4 md:mb-6 backdrop-blur-md rounded-full animate-slide-up">
                     <IconStar className="w-3 h-3 text-brand-accent fill-current" />
                     <span className="text-[10px] md:text-xs font-bold text-brand-accent uppercase tracking-widest">Featured Release</span>
                 </div>
                 
                 <h1 className="text-3xl md:text-6xl font-black text-white mb-3 md:mb-4 leading-tight tracking-tight drop-shadow-lg">
                    {featuredBook.title}
                 </h1>
                 <p className="text-sm md:text-xl text-neutral-300 mb-6 md:mb-8 line-clamp-3 leading-relaxed drop-shadow-md">
                    {featuredBook.description}
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                     <button 
                        onClick={() => handleViewDetails(featuredBook.id)}
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3.5 px-8 rounded-full hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest"
                     >
                         View Details
                     </button>
                     <button 
                        onClick={() => {
                            if (featuredBook.price === 0) navigate(`/read/${featuredBook.id}`);
                            else addToCart(featuredBook);
                        }}
                        className="px-8 py-3.5 rounded-full bg-white text-black font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                     >
                        {featuredBook.price === 0 ? <><IconBook className="w-4 h-4"/> Read Now</> : <><IconShoppingCart className="w-4 h-4"/> Add to Cart</>}
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* Floating Filter Bar - Refactored for Mobile Stability */}
      <div className="sticky top-20 z-30 mx-auto w-full mb-8 transition-all duration-300">
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl rounded-[24px] p-2 md:p-3 flex flex-col md:flex-row gap-2 md:gap-3 items-stretch">
            
            {/* Search Input - Expanded */}
            <div className="relative group w-full flex-grow">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                <input 
                    type="text"
                    placeholder="Search books, authors..."
                    className="w-full h-full bg-white/5 border border-transparent focus:border-white/10 rounded-full py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 transition-all text-sm font-bold min-h-[48px]"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters - Grid on Mobile (No clipping), Flex on Desktop */}
            <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                <CustomDropdown 
                    options={genreOptions}
                    value={selectedGenre}
                    onChange={setSelectedGenre}
                    className="w-full md:w-auto md:min-w-[160px]" 
                    placeholder="Genres"
                />
                <CustomDropdown 
                    options={priceOptions}
                    value={selectedPriceFilter}
                    onChange={(val) => setSelectedPriceFilter(val as any)}
                    className="w-full md:w-auto md:min-w-[130px]"
                    placeholder="Price"
                />
                {/* Span full width on odd mobile grid row */}
                <CustomDropdown 
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="col-span-2 md:col-span-1 w-full md:w-auto md:min-w-[150px]"
                    placeholder="Sort By"
                />
            </div>
        </div>
      </div>

      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
          {filteredAndSortedBooks.map(book => (
            <BookCard key={book.id} book={book} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 text-center px-4">
            <IconSearch className="w-12 h-12 text-neutral-600 mb-4" />
            <p className="text-xl text-white font-bold">No books found</p>
            <p className="text-neutral-500 mt-2 text-sm">Try adjusting your filters.</p>
        </div>
      )}

      {selectedBook && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="" size="lg">
            <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto md:overflow-hidden bg-black">
                <div className="w-full md:w-5/12 bg-neutral-900 relative">
                    <img 
                        src={selectedBook.coverImageUrl} 
                        alt={selectedBook.title} 
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                
                <div className="w-full md:w-7/12 flex flex-col p-6 md:p-10">
                    <div className="mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-2 block">{selectedBook.genre}</span>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-2">{selectedBook.title}</h2>
                        <p className="text-base text-neutral-400">by {selectedBook.author}</p>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 mb-6">
                        <p className="text-neutral-300 text-sm leading-relaxed font-light">
                            {selectedBook.description}
                        </p>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">
                            {selectedBook.price === 0 ? 'Free' : `₹${selectedBook.price}`}
                        </span>
                        <button 
                            onClick={handleModalAction}
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-neutral-200"
                        >
                            {selectedBook.price === 0 ? 'Read Now' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default StorePage;
