
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { User, Seller, UserType, EBook, CartItem, AppContextType, CreatorSiteConfig } from '../types';
import { mockEBooks, mockUsers } from '../services/mockData';
import { initializeGeminiChat } from '../services/geminiService';
import { Chat } from '@google/genai';

// ── Firebase Auth Bridge ────────────────────────────────────────────────────
// Co-writter lives at opendev-labs.github.io/co-writter — same domain as the
// main site. Firebase persists its auth state in localStorage under keys like
// "firebase:authUser:<apiKey>:[DEFAULT]". We read that directly — no firebase
// SDK needed — so users signed in on the main site are auto-logged in here.
const tryGetFirebaseUser = (): { name: string; email: string; picture: string } | null => {
  try {
    const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
    if (!apiKey) return null;
    const key = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const fbUser = JSON.parse(raw);
    return {
      name: fbUser.displayName || fbUser.email || 'User',
      email: fbUser.email || '',
      picture: fbUser.photoURL || '',
    };
  } catch {
    return null;
  }
};
// ───────────────────────────────────────────────────────────────────────────


const defaultAppContext: AppContextType = {
  currentUser: null,
  userType: UserType.GUEST,
  setCurrentUser: () => { },
  cart: [],
  addToCart: () => { },
  removeFromCart: () => { },
  clearCart: () => { },
  theme: 'dark',
  geminiChat: null,
  initializeChat: async () => { },
  isChatbotOpen: false,
  toggleChatbot: () => { },
  updateSellerCreatorSite: () => { },
  allBooks: [],
  addCreatedBook: () => { },
  updateEBook: () => { },
  handleGoogleLogin: () => { },
  handleEmailLogin: async () => ({ success: false }),
  upgradeToSeller: () => { },
  verifyUser: () => { },
};

const AppContext = createContext<AppContextType>(defaultAppContext);

// Key for persisting app state in browser storage
const STORAGE_KEY = 'ebook_engine_production_live_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize State from LocalStorage (Lazy Loading)
  const [currentUser, setCurrentUserState] = useState<User | Seller | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).currentUser : null;
    } catch (e) { return null; }
  });

  const [userType, setUserTypeState] = useState<UserType>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).userType : UserType.GUEST;
    } catch (e) { return UserType.GUEST; }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).cart : [];
    } catch (e) { return []; }
  });

  const [allBooks, setAllBooks] = useState<EBook[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return mockEBooks;
      const parsed = JSON.parse(stored);
      return parsed.allBooks && parsed.allBooks.length > 0 ? parsed.allBooks : mockEBooks;
    } catch (e) { return mockEBooks; }
  });

  const theme = 'dark';
  const [geminiChat, setGeminiChat] = useState<Chat | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // ── Firebase bridge: auto-login if main site already has a session ──────
  useEffect(() => {
    if (currentUser) return;
    const fbUser = tryGetFirebaseUser();
    if (!fbUser) return;
    const bridgedUser: User = {
      id: `firebase_${fbUser.email.replace(/[^a-z0-9]/gi, '_')}`,
      name: fbUser.name,
      email: fbUser.email,
      purchaseHistory: [],
      wishlist: [],
      isVerified: true,
      profileImageUrl: fbUser.picture,
    };
    setCurrentUserState(bridgedUser);
    setUserTypeState(UserType.USER);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ───────────────────────────────────────────────────────────────────────



  useEffect(() => {
    const stateToSave = {
      currentUser,
      userType,
      cart,
      allBooks
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [currentUser, userType, cart, allBooks]);

  const setCurrentUser = (user: User | Seller | null, type: UserType) => {
    setCurrentUserState(user);
    setUserTypeState(type);
    if (!user) {
      setCart([]); // Clear cart on logout
    }
  };

  const addToCart = (book: EBook) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const initializeChat = useCallback(async () => {
    if (!geminiChat) {
      console.log("Initializing Gemini Chat from AppContext...");
      const chatInstance = await initializeGeminiChat();
      setGeminiChat(chatInstance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geminiChat]);

  const toggleChatbot = () => {
    setIsChatbotOpen(prevIsOpenState => {
      const newIsChatbotOpen = !prevIsOpenState;
      if (newIsChatbotOpen && !geminiChat) {
        initializeChat();
      }
      return newIsChatbotOpen;
    });
  };

  const updateSellerCreatorSite = (config: CreatorSiteConfig) => {
    setCurrentUserState(prevUser => {
      if (prevUser && (prevUser.id.startsWith('seller') || prevUser.id.startsWith('google') || userType === UserType.SELLER)) {
        const updatedSeller = { ...prevUser as Seller, creatorSite: config };

        // Update local mock store for simulation consistency
        if (mockUsers[updatedSeller.id]) {
          (mockUsers[updatedSeller.id] as Seller).creatorSite = config;
        }
        return updatedSeller;
      }
      return prevUser;
    });
  };

  const addCreatedBook = (book: EBook) => {
    setAllBooks(prevBooks => {
      // Prevent duplicates
      if (prevBooks.some(b => b.id === book.id)) return prevBooks;
      return [book, ...prevBooks];
    });

    // If current user is a seller, also add to their uploadedBooks
    if (currentUser && userType === UserType.SELLER) {
      setCurrentUserState(prev => {
        const seller = prev as Seller;
        const currentUploadedBooks = seller.uploadedBooks || [];
        return {
          ...seller,
          uploadedBooks: [book, ...currentUploadedBooks]
        };
      });
    }
  };

  const updateEBook = (updatedBook: EBook) => {
    setAllBooks(prevBooks => prevBooks.map(b => b.id === updatedBook.id ? updatedBook : b));

    // Update the book in the current seller's uploadedBooks list
    if (currentUser && currentUser.id === updatedBook.sellerId && userType === UserType.SELLER) {
      setCurrentUserState(prevUser => {
        const seller = prevUser as Seller;
        return {
          ...seller,
          uploadedBooks: seller.uploadedBooks.map(b => b.id === updatedBook.id ? updatedBook : b)
        };
      });
    }
  };

  // --- AUTH METHODS ---

  const handleGoogleLogin = (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      // Decode JWT manually to avoid external dependency
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);

      // Map Google User to App User (Default to USER/Reader role)
      const googleUser: User = {
        id: `google_${payload.sub}`,
        name: payload.name,
        email: payload.email,
        purchaseHistory: [],
        wishlist: [],
        isVerified: false,
        profileImageUrl: payload.picture
      };

      // Check if we have previous data for this user in mock/local
      const existingData = mockUsers[googleUser.id];
      if (existingData) {
        // Restore role if they were a seller
        if ('uploadedBooks' in existingData) {
          setCurrentUser(existingData as Seller, UserType.SELLER);
          return;
        }
      }

      setCurrentUser(googleUser, UserType.USER);

      // Persist to mock data (runtime cache)
      mockUsers[googleUser.id] = googleUser;

      console.log("Logged in with Google:", googleUser.name);
    } catch (e) {
      console.error("Google Login Failed", e);
    }
  };

  // ADDED: Email Login for Admin/Owner and Paid Writers
  const handleEmailLogin = async (inputEmail: string, inputPass: string): Promise<{ success: boolean, message?: string }> => {

    const email = inputEmail.trim();
    const password = inputPass.trim();

    // 1. Secure Admin Login (Using Environment Variables with Fallback)
    // Ideally, define VITE_ADMIN_USER and VITE_ADMIN_PASS in your .env file
    let adminUser = 'opendev-labs';
    let adminPass = 'co-pass-access';

    // Use try-catch for environment variable access to prevent crash in certain environments
    try {
      // Cast import.meta to any to avoid TS error: Property 'env' does not exist on type 'ImportMeta'
      const meta = import.meta as any;
      if (meta.env) {
        adminUser = meta.env.VITE_ADMIN_USER || adminUser;
        adminPass = meta.env.VITE_ADMIN_PASS || adminPass;
      }
    } catch (e) {
      console.warn("Could not access env vars, using defaults.");
    }

    if (email === adminUser && password === adminPass) {
      const adminProfile = mockUsers['seller_opendev'];
      if (adminProfile) {
        setCurrentUser(adminProfile as Seller, UserType.SELLER);
        return { success: true };
      } else {
        return { success: false, message: "Admin profile configuration missing." };
      }
    }

    // 2. Check for other paid writers in Mock DB
    const foundUserEntry = Object.values(mockUsers).find(user => user.email === email);

    if (foundUserEntry) {
      if ('uploadedBooks' in foundUserEntry) {
        // In a real app, you would hash and verify the password here.
        // For this demo, we assume the password matches if the email exists as a seller.
        setCurrentUser(foundUserEntry as Seller, UserType.SELLER);
        return { success: true };
      } else {
        return { success: false, message: "This email is not registered as a Writer account." };
      }
    }

    return { success: false, message: "Invalid credentials." };
  };

  const upgradeToSeller = () => {
    if (currentUser && userType === UserType.USER) {
      const user = currentUser as User;

      const newSeller: Seller = {
        id: user.id,
        name: user.name,
        email: user.email,
        payoutEmail: user.email,
        uploadedBooks: [],
        isVerified: user.isVerified || false,
        username: user.username || `@${user.name.replace(/\s+/g, '').toLowerCase()}`,
        profileImageUrl: user.profileImageUrl,
        creatorSite: {
          isEnabled: false,
          slug: user.name.toLowerCase().replace(/\s+/g, '-'),
          theme: 'dark-minimal',
          profileImageUrl: user.profileImageUrl,
          displayName: user.name,
          tagline: 'Digital Creator',
          showcasedBookIds: []
        }
      };

      setCurrentUser(newSeller, UserType.SELLER);
      // Update runtime cache
      mockUsers[user.id] = newSeller;

      console.log("Upgraded to Seller:", newSeller.name);
    }
  };

  const verifyUser = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, isVerified: true };
      setCurrentUserState(updatedUser);
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, userType, setCurrentUser, cart, addToCart, removeFromCart, clearCart, theme, geminiChat, initializeChat, isChatbotOpen, toggleChatbot, updateSellerCreatorSite, allBooks, addCreatedBook, updateEBook, handleGoogleLogin, handleEmailLogin, upgradeToSeller, verifyUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);