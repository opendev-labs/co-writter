
import React, { useState, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { EBook, User } from '../../types';
import { IconBook, IconHeart, IconSettings, IconSearch, IconLogout, IconUser } from '../../constants'; 
import * as ReactRouterDOM from 'react-router-dom';
import BookCard from '../BookCard';

const { useNavigate } = ReactRouterDOM as any;

const UserDashboardContent: React.FC = () => {
  const { currentUser, setCurrentUser, userType, upgradeToSeller } = useAppContext();
  const user = currentUser as User; 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'library' | 'wishlist' | 'settings'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const profileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleLogout = () => {
    setCurrentUser(null, userType);
    navigate('/');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const updatedUser = { ...user, profileImageUrl: base64String };
            setCurrentUser(updatedUser, userType);
        };
        reader.readAsDataURL(file);
    }
  };

  const SidebarItem = ({ id, label, icon: Icon }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-4 px-6 py-3.5 text-sm font-medium rounded-r-full transition-all duration-200 group ${
            activeTab === id 
            ? 'bg-[#4285f4]/15 text-[#a8c7fa] border-l-4 border-[#4285f4]' 
            : 'text-neutral-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
        }`}
      >
          <Icon className={`w-5 h-5 ${activeTab === id ? 'text-[#a8c7fa]' : 'text-neutral-500 group-hover:text-white'}`} />
          {label}
      </button>
  );

  const MobileNavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center py-2 px-4 flex-1 transition-colors ${
          activeTab === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
      }`}
    >
        <Icon className={`w-6 h-6 mb-1 ${activeTab === id ? 'text-[#a8c7fa]' : 'text-current'}`} />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </button>
  );

  const booksToDisplay = activeTab === 'wishlist' ? user.wishlist : user.purchaseHistory;
  const filteredBooks = booksToDisplay?.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen w-full bg-[#0b0b0b] font-sans text-white pt-16 flex overflow-hidden">
        
        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 hidden md:flex flex-col bg-[#0b0b0b] z-20 h-full overflow-y-auto">
            <div className="p-6">
                <button 
                    onClick={() => navigate('/store')}
                    className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                    <IconBook className="w-5 h-5" /> Store
                </button>
            </div>

            <nav className="flex-1 space-y-1 pr-4">
                <SidebarItem id="library" label="My Library" icon={IconBook} />
                <SidebarItem id="wishlist" label="Wishlist" icon={IconHeart} />
                <div className="my-4 border-t border-white/5 mx-6"></div>
                <SidebarItem id="settings" label="Profile Settings" icon={IconSettings} />
            </nav>

            <div className="p-6 border-t border-white/5">
                 <button onClick={upgradeToSeller} className="text-xs font-medium text-neutral-500 hover:text-white transition-colors mb-4 block">
                    Switch to Writer Mode
                 </button>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden border border-white/10">
                        {user.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 font-bold">{user.name[0]}</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                 </div>
            </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 h-full overflow-y-auto bg-[#0b0b0b] relative scroll-smooth">
            <div className="p-4 md:p-8 pb-32"> {/* Extra padding for mobile bottom nav */}
                
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-normal text-white">
                        {activeTab === 'library' && 'My Library'}
                        {activeTab === 'wishlist' && 'My Wishlist'}
                        {activeTab === 'settings' && 'Settings'}
                    </h1>

                    {/* Search Bar */}
                    {(activeTab === 'library' || activeTab === 'wishlist') && (
                        <div className="relative w-full md:w-96 group">
                            <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search your books..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1e1e1e] border-none rounded-full py-3 pl-12 pr-6 text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#4285f4]/50 focus:bg-[#252525] transition-all outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Content Area */}
                {activeTab === 'settings' ? (
                    <div className="max-w-2xl animate-fade-in mx-auto md:mx-0">
                        <div className="bg-[#1e1e1e] rounded-3xl p-6 md:p-8 mb-6">
                            <h2 className="text-lg font-medium mb-6">Profile Details</h2>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-neutral-800 border-4 border-[#0b0b0b] overflow-hidden">
                                        {user.profileImageUrl ? (
                                            <img src={user.profileImageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl text-neutral-600"><IconUser className="w-10 h-10"/></div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => profileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-[#4285f4] rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <IconSettings className="w-4 h-4" />
                                    </button>
                                    <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{user.name}</h3>
                                    <p className="text-neutral-400">{user.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-[#4285f4]/10 text-[#a8c7fa] text-xs font-bold rounded-full">Reader Account</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <button onClick={upgradeToSeller} className="w-full py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
                                    Become a Writer
                                </button>
                                <button onClick={handleLogout} className="w-full py-3 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm">
                                    <IconLogout className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {filteredBooks && filteredBooks.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                {filteredBooks.map(book => (
                                    <div key={book.id} className="group">
                                        <BookCard book={book} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6">
                                    <IconBook className="w-8 h-8 text-neutral-600" />
                                </div>
                                <h3 className="text-lg md:text-xl font-medium text-white mb-2">
                                    {activeTab === 'wishlist' ? 'Your wishlist is empty' : 'No books in library'}
                                </h3>
                                <p className="text-neutral-500 mb-8 max-w-xs mx-auto text-sm">
                                    {activeTab === 'wishlist' ? 'Save books you want to read later.' : 'Start your reading journey by exploring the store.'}
                                </p>
                                <button 
                                    onClick={() => navigate('/store')} 
                                    className="px-8 py-3 bg-[#4285f4] text-black font-bold rounded-full hover:bg-[#5b96f5] transition-colors"
                                >
                                    Explore Books
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0b0b0b]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50 pb-safe">
            <MobileNavItem id="library" label="Library" icon={IconBook} />
            <MobileNavItem id="wishlist" label="Wishlist" icon={IconHeart} />
            <MobileNavItem id="settings" label="Profile" icon={IconSettings} />
        </div>
    </div>
  );
};

export default UserDashboardContent;
