import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Seller, EBook, CreatorSiteConfig } from '../types';
import { mockUsers, mockEBooks } from '../services/mockData'; // Direct import for demo
import { APP_NAME, BORDER_CLASS, IconBook } from '../constants';

const { useParams, Link } = ReactRouterDOM as any;

const CreatorSitePage: React.FC = () => {
  const { slug } = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [siteConfig, setSiteConfig] = useState<CreatorSiteConfig | null>(null);
  const [showcasedBooks, setShowcasedBooks] = useState<EBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching seller data by slug
    // In a real app, this would be an API call: fetchSellerBySlug(slug)
    const foundSeller = Object.values(mockUsers).find(
      u => (u as Seller).creatorSite?.slug === slug && (u as Seller).id.startsWith('seller')
    ) as Seller | undefined;

    if (foundSeller && foundSeller.creatorSite && foundSeller.creatorSite.isEnabled) {
      setSeller(foundSeller);
      setSiteConfig(foundSeller.creatorSite);
      const booksToDisplay = mockEBooks.filter(book => 
        foundSeller.creatorSite!.showcasedBookIds.includes(book.id) && book.sellerId === foundSeller.id
      );
      setShowcasedBooks(booksToDisplay);
    } else {
      setSeller(null);
      setSiteConfig(null);
      setShowcasedBooks([]);
    }
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    // Apply theme class to body or a wrapper div
    if (siteConfig?.theme) {
      document.body.className = ''; // Clear existing classes
      document.body.classList.add(`theme-${siteConfig.theme}`, 'creator-site-body', 'font-sans');
    }
    return () => {
      // Cleanup: remove theme class when component unmounts
      document.body.className = 'font-sans'; // Reset to default
      document.body.style.backgroundColor = '#080808'; // Reset main app bg
    };
  }, [siteConfig?.theme]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-brand-bg-dark text-white">
        Loading Creator Page...
      </div>
    );
  }

  if (!seller || !siteConfig) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-brand-bg-dark text-white p-6 text-center">
        <IconBook className="w-20 h-20 text-brand-accent opacity-50 mb-6" />
        <h1 className="text-4xl font-bold mb-3">Creator Page Not Found</h1>
        <p className="text-neutral-400 mb-6">The page you're looking for doesn't exist or hasn't been configured by the seller.</p>
        <Link to="/" className={`px-6 py-2.5 rounded-sm font-semibold transition-all duration-200 bg-brand-accent text-black hover:bg-brand-accent-darker`}>
          Back to {APP_NAME}
        </Link>
      </div>
    );
  }
  
  // Dynamic class for the main wrapper based on theme
  const themeWrapperClass = `theme-${siteConfig.theme}`;

  return (
    <div className={`${themeWrapperClass} pt-20`}> {/* Added top padding for fixed navbar clearance if needed, though this page layout is custom */}
      <header className="creator-site-header">
        {siteConfig.profileImageUrl && (
          <img 
            src={siteConfig.profileImageUrl} 
            alt={siteConfig.displayName || seller.name} 
            className="creator-site-profile-img" 
          />
        )}
        <h1 className="creator-site-display-name">{siteConfig.displayName || seller.name}</h1>
        {siteConfig.tagline && <p className="creator-site-tagline">{siteConfig.tagline}</p>}
      </header>

      <main className="container mx-auto px-4 py-8">
        {showcasedBooks.length > 0 ? (
          <div className="creator-site-books-grid">
            {showcasedBooks.map(book => (
              <div key={book.id} className="creator-site-book-card">
                <img src={book.coverImageUrl} alt={book.title} className="creator-site-book-cover" />
                <div className="creator-site-book-info">
                  <h2 className="creator-site-book-title" title={book.title}>{book.title}</h2>
                  <p className="creator-site-book-author">By {book.author}</p>
                  <p className="creator-site-book-price">₹{book.price.toFixed(2)}</p>
                  {/* Link to the main store page for the book */}
                  <Link 
                    to={`/store?bookId=${book.id}`} // Or a more specific book detail page if it exists
                    className="creator-site-book-button"
                    target="_blank" // Open in new tab to keep creator site open
                    rel="noopener noreferrer"
                  >
                    View on {APP_NAME}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg col-span-full py-10">This creator hasn't showcased any eBooks yet.</p>
        )}
      </main>
      
      <footer className="creator-site-footer">
        <p>&copy; {new Date().getFullYear()} {siteConfig.displayName || seller.name}. Powered by <Link to="/" target="_blank" rel="noopener noreferrer">{APP_NAME}</Link>.</p>
      </footer>
    </div>
  );
};

export default CreatorSitePage;