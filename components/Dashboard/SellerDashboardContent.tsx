
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Seller, EBook, CreatorSiteConfig, UserType } from '../../types';
import BookUploadForm from '../BookUpload/BookUploadForm';
import AnalyticsChart from './AnalyticsChart';
import { 
    IconSettings, IconBook, IconSparkles, 
    IconEdit, IconWallet, IconCheck, IconRocket, 
    IconActivity, IconPlus, IconCloudUpload, IconGithub, IconLink,
    IconUser, IconEye, IconClock, IconGlobe, IconHome, IconDashboard
} from '../../constants'; 
import * as ReactRouterDOM from 'react-router-dom';
import { saveUserDataToGitHub } from '../../services/cloudService';
import { mockUsers } from '../../services/mockData';

const { useNavigate } = ReactRouterDOM as any;

const mockVisitors = [
    { id: 1, name: "Alice Freeman", email: "alice.f...@gmail.com", location: "Mumbai, IN", time: "2 mins ago", status: "Signed In", action: "Viewed 'The Void Start'", avatar: "A" },
    { id: 2, name: "Bob Script", email: "bob.script...@outlook.com", location: "London, UK", time: "15 mins ago", status: "Signed In", action: "Purchased 'Neural Architectures'", avatar: "B" },
    { id: 3, name: "Guest User", email: "—", location: "New York, US", time: "42 mins ago", status: "Guest", action: "Browsing Store", avatar: "?" },
    { id: 4, name: "Diana Prince", email: "diana.p...@gmail.com", location: "Toronto, CA", time: "1 hour ago", status: "Signed In", action: "Added to Cart", avatar: "D" },
    { id: 5, name: "Evan Wright", email: "evan.w...@yahoo.com", location: "Sydney, AU", time: "3 hours ago", status: "Signed In", action: "Viewed Profile", avatar: "E" },
    { id: 6, name: "Guest User", email: "—", location: "Berlin, DE", time: "5 hours ago", status: "Guest", action: "Read Preview", avatar: "?" },
];

export const SellerDashboardContent: React.FC = () => {
  const { currentUser, updateSellerCreatorSite, addCreatedBook, setCurrentUser, userType } = useAppContext();
  const seller = currentUser as Seller; 
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'audience' | 'settings' | 'admin'>('overview');
  const navigate = useNavigate();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

  const myUploadedBooks = seller?.uploadedBooks || [];

  const [creatorSiteForm, setCreatorSiteForm] = useState<CreatorSiteConfig>(
    seller?.creatorSite || {
      isEnabled: false,
      slug: seller?.name.toLowerCase().replace(/\s+/g, '-'),
      theme: 'dark-minimal',
      profileImageUrl: seller?.profileImageUrl || '',
      displayName: seller?.name || '',
      tagline: 'Author & Digital Creator',
      showcasedBookIds: [],
    }
  );

  useEffect(() => {
    if (seller?.creatorSite) {
      setCreatorSiteForm(seller.creatorSite);
    }
  }, [seller]);

  if (!seller) return null;

  const handleBookUploaded = (book: EBook) => {
    addCreatedBook(book); 
    setActiveTab('overview');
  };

  const handleDeployToGitHub = async () => {
    if (!creatorSiteForm.slug) return;
    setIsDeploying(true);
    updateSellerCreatorSite(creatorSiteForm);
    const result = await saveUserDataToGitHub(creatorSiteForm.slug, {
        sellerProfile: seller,
        siteConfig: creatorSiteForm,
        books: myUploadedBooks
    });
    if (result.success) {
        setDeploymentUrl(result.url || null);
    }
    setIsDeploying(false);
  };

  const handleCreatorSiteFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setCreatorSiteForm(prev => ({ ...prev, [name]: checked }));
    } else {
        setCreatorSiteForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const SidebarItem = ({ id, label, icon: Icon, onClick }: any) => (
    <button 
      onClick={onClick || (() => setActiveTab(id))}
      className={`w-full flex items-center gap-4 px-6 py-3.5 text-sm font-medium rounded-r-full transition-all duration-200 group ${
          activeTab === id 
          ? 'bg-[#34a853]/15 text-[#81c995] border-l-4 border-[#34a853]' 
          : 'text-neutral-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
      }`}
    >
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-[#81c995]' : 'text-neutral-500 group-hover:text-white'}`} />
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
        <Icon className={`w-6 h-6 mb-1 ${activeTab === id ? 'text-[#81c995]' : 'text-current'}`} />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
    </button>
  );

  const isOwner = seller.isAdmin === true || seller.email === 'subatomicerror@gmail.com';

  return (
    <div className="h-screen w-full bg-[#0b0b0b] font-sans text-white pt-16 flex overflow-hidden">
        
        {/* --- SIDEBAR (Desktop) --- */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 hidden md:flex flex-col bg-[#0b0b0b] z-20 h-full overflow-y-auto">
            
            <nav className="flex-1 space-y-1 pr-4 mt-6">
                {/* Back to Home Action */}
                <SidebarItem id="home" label="Back to Home" icon={IconHome} onClick={() => navigate('/')} />
                <div className="my-4 border-t border-white/5 mx-6"></div>
                
                <SidebarItem id="overview" label="Overview" icon={IconActivity} />
                <SidebarItem id="audience" label="Audience" icon={IconUser} />
                <SidebarItem id="studio" label="Content Manager" icon={IconCloudUpload} />
                <div className="my-4 border-t border-white/5 mx-6"></div>
                <SidebarItem id="settings" label="Site Settings" icon={IconSettings} />
                
                {isOwner && (
                    <>
                        <div className="my-4 border-t border-white/5 mx-6"></div>
                        <SidebarItem id="admin" label="System Admin" icon={IconDashboard} />
                    </>
                )}
            </nav>

            <div className="p-6 border-t border-white/5">
                 <button 
                    onClick={() => setCurrentUser(currentUser, UserType.USER)}
                    className="text-xs font-medium text-neutral-500 hover:text-white transition-colors mb-4 block"
                 >
                    Switch to Reading Mode
                 </button>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden border border-white/10">
                        {seller.profileImageUrl ? (
                            <img src={seller.profileImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 font-bold">{seller.name[0]}</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate flex items-center gap-2">
                            {seller.name}
                            {seller.isVerified && <IconCheck className="w-3 h-3 text-[#34a853]" />}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                            {isOwner ? 'System Owner' : 'Writer Account'}
                        </p>
                    </div>
                 </div>
            </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 h-full overflow-y-auto bg-[#0b0b0b] relative scroll-smooth">
            <div className="p-4 md:p-8 pb-32">
            
                 <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl font-normal text-white">
                        {activeTab === 'overview' && (isOwner ? 'Global Overview' : 'Dashboard Overview')}
                        {activeTab === 'audience' && 'Live Audience'}
                        {activeTab === 'studio' && 'Content Manager'}
                        {activeTab === 'settings' && 'Site Configuration'}
                        {activeTab === 'admin' && 'System Administration'}
                    </h1>
                </div>

                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "Revenue", value: isOwner ? "₹1,240,500" : "₹24,500", icon: IconWallet, color: "text-[#81c995]" },
                                { label: "Total Visitors", value: isOwner ? "84,320" : "1,240", icon: IconActivity, color: "text-[#a8c7fa]" },
                                { label: isOwner ? "Total Books" : "Active Books", value: isOwner ? "342" : myUploadedBooks.length.toString(), icon: IconBook, color: "text-[#fdd663]" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#1e1e1e] p-6 rounded-3xl border border-white/5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold bg-green-900/30 text-green-400 px-2 py-1 rounded-full">+12%</span>
                                    </div>
                                    <h3 className="text-3xl font-normal text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-neutral-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-white/5 h-[300px] md:h-[400px]">
                            <AnalyticsChart className="w-full h-full" title={isOwner ? "Platform Revenue" : "Revenue Trend"} />
                        </div>

                        {!isOwner && (
                            <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden border border-white/5">
                                <div className="px-6 md:px-8 py-6 border-b border-white/5 flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Recent Uploads</h3>
                                    <button onClick={() => setActiveTab('studio')} className="text-sm text-[#81c995] font-bold hover:underline">View All</button>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {myUploadedBooks.slice(0, 5).map(book => (
                                        <div key={book.id} className="px-6 md:px-8 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <img src={book.coverImageUrl} className="w-10 h-14 object-cover rounded bg-black" alt="" />
                                                <div>
                                                    <p className="font-bold text-sm text-white group-hover:text-[#a8c7fa] transition-colors line-clamp-1">{book.title}</p>
                                                    <p className="text-xs text-neutral-500">₹{book.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-neutral-500 hidden sm:block">{new Date(book.publicationDate).toLocaleDateString()}</span>
                                                <button onClick={() => navigate(`/edit-ebook/${book.id}`)} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white">
                                                    <IconEdit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {myUploadedBooks.length === 0 && <p className="p-8 text-center text-neutral-500 text-sm">No books uploaded yet.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {/* --- AUDIENCE TAB --- */}
                {activeTab === 'audience' && (
                    <div className="animate-fade-in max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-1">Live Feed</h2>
                                <p className="text-neutral-400 text-xs">Real-time visitor tracking</p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#34a853]/10 px-3 py-1.5 rounded-full border border-[#34a853]/20">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34a853] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34a853]"></span>
                                </span>
                                <span className="text-[10px] font-bold text-[#81c995] uppercase tracking-widest">Active</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {mockVisitors.map((visitor) => (
                                <div key={visitor.id} className="group bg-[#1e1e1e] hover:bg-[#252525] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300">
                                    <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-bold text-sm text-white shadow-inner">
                                            {visitor.avatar}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white text-sm">{visitor.name}</div>
                                            <div className="text-xs text-neutral-500">{visitor.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:w-[150px] text-neutral-400 text-sm">
                                        <IconGlobe className="w-4 h-4 text-neutral-600" />
                                        <span>{visitor.location}</span>
                                    </div>
                                    <div className="flex-1 md:w-[250px]">
                                         <div className="flex items-center gap-2 text-white text-sm mb-0.5">
                                            <IconActivity className="w-3 h-3 text-[#a8c7fa]" />
                                            <span className="truncate">{visitor.action}</span>
                                         </div>
                                         <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                                            <IconClock className="w-3 h-3" /> {visitor.time}
                                         </div>
                                    </div>
                                    <div className="md:w-[120px] flex justify-end">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                                            visitor.status === 'Signed In' 
                                            ? 'bg-[#34a853]/10 text-[#81c995] border border-[#34a853]/20' 
                                            : 'bg-white/5 text-neutral-500 border border-white/5'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${visitor.status === 'Signed In' ? 'bg-[#34a853]' : 'bg-neutral-500'}`}></span>
                                            {visitor.status === 'Signed In' ? 'User' : 'Guest'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- STUDIO TAB --- */}
                {activeTab === 'studio' && (
                    <div className="animate-fade-in max-w-5xl mx-auto space-y-12">
                        <div className="bg-[#1e1e1e] border border-white/5 rounded-3xl overflow-hidden">
                            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                <h2 className="text-xl font-bold text-white mb-1">Your Manuscripts</h2>
                                <p className="text-sm text-neutral-500">Edit content, update pricing, or manage visual assets.</p>
                            </div>
                            
                            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {myUploadedBooks.length > 0 ? (
                                    myUploadedBooks.map(book => (
                                        <div key={book.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-white/[0.02] transition-colors group">
                                            <img 
                                                src={book.coverImageUrl} 
                                                alt={book.title} 
                                                className="w-16 h-24 object-cover rounded-lg shadow-lg bg-[#0b0b0b] border border-white/10"
                                            />
                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors">{book.title}</h3>
                                                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-neutral-500 mb-2">
                                                    <span className="uppercase tracking-wider font-bold">{book.genre}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">₹{book.price}</span>
                                                </div>
                                                <p className="text-xs text-neutral-600 line-clamp-1 max-w-md">{book.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => navigate(`/read/${book.id}`)}
                                                    className="p-3 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                                                    title="Read Preview"
                                                >
                                                    <IconEye className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/edit-ebook/${book.id}`)}
                                                    className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                                >
                                                    <IconEdit className="w-4 h-4" /> Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-neutral-500">
                                        <IconBook className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>You haven't uploaded any books yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10"></div>
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Create New</span>
                                <div className="h-px flex-1 bg-white/10"></div>
                            </div>
                            <BookUploadForm onBookUploaded={handleBookUploaded} />
                        </div>
                    </div>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-[#1e1e1e] rounded-3xl p-6 md:p-8 border border-white/5">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-medium">Public Profile</h2>
                                {deploymentUrl && (
                                    <a href={deploymentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-[#81c995] bg-[#34a853]/10 px-3 py-1 rounded-full">
                                        <span className="w-2 h-2 rounded-full bg-[#34a853] animate-pulse"></span> Live
                                    </a>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Display Name</label>
                                    <input name="displayName" value={creatorSiteForm.displayName} onChange={handleCreatorSiteFormChange} className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-white/30 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Tagline</label>
                                    <textarea name="tagline" value={creatorSiteForm.tagline} onChange={handleCreatorSiteFormChange} rows={3} className="w-full bg-[#0b0b0b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-white/30 text-white resize-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Username (Slug)</label>
                                    <div className="flex">
                                        <span className="bg-[#151515] border border-r-0 border-white/10 text-neutral-500 px-3 py-3 text-sm rounded-l-lg hidden sm:block">ebook-engine.github.io/</span>
                                        <input name="slug" value={creatorSiteForm.slug} onChange={handleCreatorSiteFormChange} className="flex-1 bg-[#0b0b0b] border border-white/10 rounded-lg sm:rounded-l-none p-3 text-sm focus:outline-none focus:border-white/30 text-white" />
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleDeployToGitHub} 
                                    disabled={isDeploying}
                                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 mt-4"
                                >
                                    {isDeploying ? 'Deploying...' : <><IconCloudUpload className="w-5 h-5"/> Publish Site</>}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#1e1e1e] rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <IconGithub className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">GitHub Integration</h3>
                                <p className="text-sm text-neutral-400 max-w-xs mb-6">
                                    Your creator site is hosted for free on GitHub Pages. Changes may take up to 2 minutes to propagate globally.
                                </p>
                                {deploymentUrl ? (
                                    <div className="bg-[#0b0b0b] p-4 rounded-xl border border-white/10 w-full flex justify-between items-center">
                                        <span className="text-xs text-neutral-500 truncate">{deploymentUrl}</span>
                                        <a href={deploymentUrl} target="_blank" className="text-[#81c995] hover:text-white"><IconLink className="w-4 h-4"/></a>
                                    </div>
                                ) : (
                                    <div className="bg-[#0b0b0b] p-4 rounded-xl border border-white/10 w-full text-xs text-neutral-600">
                                        Not deployed yet.
                                    </div>
                                )}
                            </div>

                             <div className="bg-[#1e1e1e] rounded-3xl p-6 border border-white/5">
                                 <button onClick={() => setCurrentUser(seller, UserType.USER)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors text-sm">
                                    Switch to Reader Mode
                                 </button>
                             </div>
                        </div>
                    </div>
                )}

                {/* --- ADMIN TAB --- */}
                {activeTab === 'admin' && isOwner && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-[#1e1e1e] border border-white/5 rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Registered Users</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-neutral-500 text-xs uppercase tracking-widest">
                                            <th className="py-4 px-2 font-bold">User</th>
                                            <th className="py-4 px-2 font-bold">Email</th>
                                            <th className="py-4 px-2 font-bold">Role</th>
                                            <th className="py-4 px-2 font-bold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {Object.values(mockUsers).filter(u => u.id !== 'guest').map((user) => (
                                            <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-2 font-medium text-white flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">
                                                        {user.profileImageUrl ? <img src={user.profileImageUrl} alt="" className="w-full h-full rounded-full"/> : user.name[0]}
                                                    </div>
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-2 text-neutral-400">{user.email}</td>
                                                <td className="py-4 px-2">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                                        (user as Seller).isAdmin ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' : 
                                                        'uploadedBooks' in user ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20' : 
                                                        'bg-white/5 text-neutral-500'
                                                    }`}>
                                                        {(user as Seller).isAdmin ? 'Admin' : 'uploadedBooks' in user ? 'Writer' : 'Reader'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-right">
                                                    <button className="text-xs text-neutral-500 hover:text-white underline">Manage</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>

        {/* --- FLOATING ACTION BUTTON (FAB) --- */}
        {!isOwner && (
            <button 
                onClick={() => navigate('/ebook-studio')}
                className="fixed bottom-24 right-8 z-50 w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all group"
                aria-label="Create New Story"
            >
                <IconRocket className="w-8 h-8 group-hover:-translate-y-1 transition-transform" />
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Start New Manuscript
                </span>
            </button>
        )}

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0b0b0b]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50 pb-safe">
            <MobileNavItem id="overview" label="Stats" icon={IconActivity} />
            <MobileNavItem id="audience" label="Visitors" icon={IconUser} />
            <MobileNavItem id="studio" label="Content" icon={IconCloudUpload} />
            <MobileNavItem id="settings" label="Config" icon={IconSettings} />
            {isOwner && <MobileNavItem id="admin" label="Admin" icon={IconDashboard} />}
        </div>
    </div>
  );
};
