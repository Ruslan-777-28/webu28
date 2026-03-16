export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type BlogPost = {
  id: string; // Firestore document ID
  
  // Core Content
  contentType: 'blog';
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;

  // Media
  coverImageUrl?: string;
  coverAlt?: string;

  // Author
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string; // Denormalized for convenience

  // Taxonomy
  category: string;
  tags?: string[];

  // Status & Visibility
  status: ArticleStatus;
  featured?: boolean;
  pinned?: boolean;
  showInLatest?: boolean;
  showInPopular?: boolean;

  // SEO & Metadata
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  
  // Analytics
  readingTime?: number; // in minutes
  wordCount?: number;
  views?: number;

  // Timestamps
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  publishedAt?: any | null; // Firestore Timestamp
  scheduledAt?: any | null; // Firestore Timestamp
};


export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articlesCount: number;
  isVisible: boolean;
};

export type BlogSettings = {
    blogPageTitle: string;
    blogPageSubtitle?: string;
    heroDescription?: string;
    heroPrimaryCtaLabel?: string;
    heroPrimaryCtaLink?: string;
    heroSecondaryCtaLabel?: string;
    heroSecondaryCtaLink?: string;
    featuredSectionTitle?: string;
    latestSectionTitle?: string;
    popularSectionTitle?: string;
    categoriesSectionTitle?: string;
    authorsSectionTitle?: string;
    subscribeTitle?: string;
    subscribeDescription?: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImageUrl?: string;
    canonicalUrl?: string;
    articlesPerPage: number;
    defaultSort?: 'latest' | 'popular';
    showFeaturedSection: boolean;
    showPopularSection: boolean;
    showCategoriesSection: boolean;
    showAuthorsSection: boolean;
    showSubscribeBlock: boolean;
    categories?: string[];
    tags?: string[];
};

export type UserAccountStatus = 'active' | 'limited' | 'suspended' | 'banned';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  roles: {
    user: boolean;
    expert: boolean;
    author: boolean;
    editor: boolean;
    moderator: boolean;
    admin: boolean;
  };
  adminAccess: {
    isStaff: boolean;
    panelEnabled: boolean;
  };
  bio?: string;
  avatarUrl?: string;
  preferredLanguage?: string;
  availability?: {
    status: 'available' | 'busy' | 'away';
    until?: import('firebase/firestore').Timestamp | null;
  };
  createdAt: import('firebase/firestore').Timestamp;

  // Platform Admin Fields
  accountStatus?: UserAccountStatus;
  adminMeta?: {
    notes?: string;
    lastReviewedAt?: import('firebase/firestore').Timestamp;
    lastReviewedBy?: string; // UID of admin
  };
  suspension?: {
    isSuspended: boolean;
    reason?: string;
    until?: import('firebase/firestore').Timestamp | null;
    setAt: import('firebase/firestore').Timestamp;
    setBy: string; // UID of admin
  };
};

export type AdminActionLog = {
  id?: string;
  targetType: 'user' | 'post' | 'product';
  targetId: string;
  action: string; // e.g., "setStatus", "updateNotes", "suspend", "ban"
  reason?: string;
  payload?: any;
  createdAt: any; // Firestore Timestamp
  createdBy: string; // UID of admin
  createdByName: string; // Denormalized admin name
};
