
import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Seller, EBook, CreatorSiteConfig } from '../types';
import { mockUsers, mockEBooks } from '../services/mockData';
import { loadUserProfileFromGitHub } from '../services/cloudService';
import { IconBook, IconGithub, IconGlobe, IconLink } from '../constants';
import { useAppContext } from '../contexts/AppContext';

const { useParams, Link } = ReactRouterDOM as any;

const HostingPreviewPage: React.FC = () => {
  const { username } = useParams();
  const { allBooks } = useAppContext();
  
  const [seller, setSeller] = useState<Seller | null>(null);
  const [siteConfig, setSiteConfig] = useState<CreatorSiteConfig | null>(null);
  const [showcasedBooks, setShowcasedBooks] = useState<EBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        if (!username) {
            setIsLoading(false);
            return;
        }

        // 1. Try fetching from "Cloud" (LocalStorage simulation from cloudService)
        // This handles data for users who just "Deployed" their site in the dashboard.
        const cloudData = await loadUserProfileFromGitHub(username);
        
        if (cloudData && cloudData.sellerProfile) {
            setSeller(cloudData.sellerProfile);
            setSiteConfig(cloudData.siteConfig);
            
            // For cloud data, the books should be in the payload, but we can also match by ID
            const savedBooks = cloudData.books || [];
            setShowcasedBooks(savedBooks);
            
            setIsLoading(false);
            return;
        }

        // 2. Fallback to Static Mock Data (e.g. for the default 'admin' account if not deployed yet)
        setTimeout(() => {
            const foundSeller = Object.values(mockUsers).find(
                u => (u as Seller).creatorSite?.slug === username || 
                     (u as Seller).username?.replace('@','') === username ||
                     (u as Seller).id === username
            ) as Seller | undefined;

            if (foundSeller && foundSeller.creatorSite) {
                setSeller(foundSeller);
                setSiteConfig(foundSeller.creatorSite);
                
                // Combine mockBooks and newly created books from context
                const combinedBooks = [...mockEBooks, ...allBooks];
                // De-duplicate by ID
                const uniqueBooks = Array.from(new Map(combinedBooks.map(item => [item.id, item])).values());
                
                const booksToDisplay = uniqueBooks.filter(book => 
                    foundSeller.creatorSite!.showcasedBookIds.includes(book.id) && book.sellerId === foundSeller.id
                );
                setShowcasedBooks(booksToDisplay);
            }
            setIsLoading(false);
        }, 800);
    };

    fetchData();
  }, [username, allBooks]);

  // Apply standalone theme logic
  useEffect(() => {
    // Force body style for standalone look
    document.body.style.backgroundColor = siteConfig?.theme === 'light-elegant' ? '#ffffff' : '#0a0a0a';
    document.body.style.color = siteConfig?.theme === 'light-elegant' ? '#000000' : '#ffffff';
    
    return () => {
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
    }
  }, [siteConfig]);

  if (isLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="uppercase tracking-widest text-xs">Resolving host: ebook-engine.github.io...</p>
          </div>
      );
  }

  if (!seller || !siteConfig) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black text-neutral-500 font-mono text-center p-6">
              <div className="mb-4">404</div>
              <h1 className="text-xl text-white mb-2">Site Not Found</h1>
              <p className="text-sm">The GitHub Pages site for "{username}" does not exist.</p>
          </div>
      );
  }

  const isLight = siteConfig.theme === 'light-elegant';

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-white text-neutral-900' : 'bg-[#050505] text-white'}`}>
        
        {/* Simulated Browser Bar for Realism */}
        <div className="bg-[#1a1a1a] text-neutral-400 text-[10px] font-mono py-1 px-4 flex items-center gap-4 border-b border-[#333]">
             <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
             </div>
             <div className="flex-1 bg-[#000] rounded px-3 py-0.5 flex items-center gap-2">
                 <IconGithub className="w-3 h-3 text-neutral-500"/>
                 <span>https://ebook-engine.github.io/{siteConfig.slug}</span>
             </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
            {/* Header */}
            <header className="text-center mb-20 animate-slide-up">
                <div className={`w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 ${isLight ? 'border-neutral-100 shadow-xl' : 'border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.1)]'}`}>
                    {siteConfig.profileImageUrl ? (
                        <img src={siteConfig.profileImageUrl} alt={seller.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-3xl font-bold ${isLight ? 'bg-neutral-100' : 'bg-white/10'}`}>
                            {seller.name.charAt(0)}
                        </div>
                    )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{siteConfig.displayName}</h1>
                <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {siteConfig.tagline}
                </p>

                {/* Social Proof / Links */}
                <div className="flex justify-center gap-6 mt-8">
                     <button className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-white/10 hover:bg-white/10'}`}>
                         <IconGithub className="w-4 h-4" />
                         <span className="text-xs font-bold uppercase tracking-widest">Follow</span>
                     </button>
                     <button className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-white/10 hover:bg-white/10'}`}>
                         <IconGlobe className="w-4 h-4" />
                         <span className="text-xs font-bold uppercase tracking-widest">Website</span>
                     </button>
                </div>
            </header>

            {/* Book Grid */}
            <main>
                <div className={`flex items-center gap-4 mb-10 ${isLight ? 'border-neutral-200' : 'border-white/10'} border-b pb-4`}>
                    <IconBook className={`w-5 h-5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`} />
                    <h2 className="text-sm font-bold uppercase tracking-widest">Published Works</h2>
                </div>

                {showcasedBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {showcasedBooks.map(book => (
                            <div key={book.id} className={`group flex gap-6 p-6 rounded-2xl transition-all hover:-translate-y-1 ${isLight ? 'bg-neutral-50 hover:bg-white hover:shadow-xl' : 'bg-white/5 hover:bg-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]'}`}>
                                <div className={`w-24 h-36 flex-shrink-0 shadow-lg rounded overflow-hidden ${isLight ? '' : 'border border-white/10'}`}>
                                    <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="mb-auto">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 inline-block ${isLight ? 'bg-neutral-200 text-neutral-600' : 'bg-white/10 text-neutral-400'}`}>
                                            {book.genre}
                                        </span>
                                        <h3 className="text-xl font-bold leading-tight mb-1">{book.title}</h3>
                                        <p className={`text-sm ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                            {book.description.substring(0, 60)}...
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-mono text-lg font-medium">
                                            {book.price === 0 ? 'Free' : `₹${book.price}`}
                                        </span>
                                        <Link 
                                            to={`/store?bookId=${book.id}`}
                                            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline ${isLight ? 'text-blue-600' : 'text-blue-400'}`}
                                        >
                                            Get Book <IconLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-20 border border-dashed rounded-xl ${isLight ? 'border-neutral-300 text-neutral-400' : 'border-white/10 text-neutral-600'}`}>
                        <p className="font-mono text-xs uppercase tracking-widest">No books deployed yet.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className={`mt-32 pt-10 border-t text-center ${isLight ? 'border-neutral-200 text-neutral-400' : 'border-white/10 text-neutral-600'}`}>
                <p className="text-xs font-mono">
                    &copy; {new Date().getFullYear()} {siteConfig.displayName}. Hosted via Ebook-Engine.
                </p>
            </footer>
        </div>
    </div>
  );
};

export default HostingPreviewPage;