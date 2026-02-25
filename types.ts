
import React from 'react';
import { Chat } from "@google/genai";

export interface EBookPage {
  id: string;
  title: string;
  content: string;
  pageNumber: number;
}

export interface EBook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImageUrl: string;
  genre: string;
  sellerId: string;
  publicationDate: string;
  pages?: EBookPage[]; // Added pages support
  pdfUrl?: string; // Added to support actual PDF uploads
  isDraft?: boolean; // Added draft status
}

export interface User {
  id: string;
  name: string;
  email: string;
  purchaseHistory: EBook[];
  wishlist: EBook[];
  isVerified?: boolean; // Added for Blue Tick
  // Social Profile Fields
  username?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  bio?: string;
}

export type CreatorSiteTheme = 'dark-minimal' | 'light-elegant' | 'tech-vibrant';

export interface CreatorSiteConfig {
  isEnabled: boolean;
  slug: string;
  theme: CreatorSiteTheme;
  profileImageUrl?: string;
  displayName?: string;
  tagline?: string;
  showcasedBookIds: string[]; // IDs of EBooks to display
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  payoutEmail: string; // For Razorpay or other payout methods
  payoutUpiId?: string; // Added UPI ID for 70% split
  uploadedBooks: EBook[];
  creatorSite?: CreatorSiteConfig;
  isVerified?: boolean; // Added for Blue Tick
  isAdmin?: boolean; // ADDED: For the Owner (subatomicerror@gmail.com)
  // Social Profile Fields
  username?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  bio?: string;
}

export enum UserType {
  GUEST = 'guest',
  USER = 'user',
  SELLER = 'seller',
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface CartItem extends EBook {
  quantity: number;
}

export interface AppContextType {
  currentUser: User | Seller | null;
  userType: UserType;
  setCurrentUser: (user: User | Seller | null, type: UserType) => void;
  cart: CartItem[];
  addToCart: (book: EBook) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  theme: string; // 'dark' is default
  geminiChat: Chat | null;
  initializeChat: () => Promise<void>;
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  updateSellerCreatorSite: (config: CreatorSiteConfig) => void;
  allBooks: EBook[]; // Added to manage AI-created books dynamically
  addCreatedBook: (book: EBook) => void; // For AI eBook creation
  updateEBook: (book: EBook) => void; // Added for editing eBooks
  handleGoogleLogin: (credentialResponse: any) => void; // Added for Google Login
  handleEmailLogin: (email: string, password: string) => Promise<{success: boolean, message?: string}>; // ADDED: Email Login
  upgradeToSeller: () => void; // Upgrade User to Seller
  verifyUser: () => void; // Added for Blue Tick Verification
}

export interface GroundingChunkWeb {
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}
export interface GroundingMetadata {
  searchQuery?: string;
  groundingChunks?: GroundingChunk[];
}

// For AI Generated Cover
export interface GeneratedImage {
  imageBytes: string; // Base64 encoded image
  prompt?: string;
  revisedPrompt?: string;
}

// AI Creation Types
export interface ChapterOutline {
  title: string;
  summary: string;
}

export interface BookOutline {
  title: string;
  chapters: ChapterOutline[];
}

export interface AnalyzedStyle {
  fontPrimary: string;
  fontSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorBackground: string;
  colorText: string;
}

// --- Agentic Workflow Types ---

export type AgentRole = 'planner' | 'writer' | 'designer' | 'reviewer' | 'researcher' | 'idle';

export interface AgentLog {
  id: string;
  agent: AgentRole;
  message: string;
  timestamp: number;
}

export interface AgentTask {
  id: string;
  type: AgentRole;
  status: 'pending' | 'working' | 'completed' | 'failed';
  description: string;
}
