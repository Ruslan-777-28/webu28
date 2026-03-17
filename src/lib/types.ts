export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type PostContentType = 'blog' | 'post';
export type EditorialStatus = 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'published' | 'rejected';
export type SourcePlatform = 'site' | 'app' | 'admin';

export type Post = {
  id: string; // Firestore document ID
  
  // Core Content
  contentType: PostContentType;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;

  // Media
  coverImageUrl?: string;
  coverAlt?: string;
  ogImageUrl?: string;

  // Author
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string; // Denormalized for convenience

  // Taxonomy
  categoryId: string;
  subcategoryId?: string;
  tags?: string[];

  // Status & Visibility (Primarily for 'blog' contentType)
  status: PostStatus;
  featured?: boolean;
  pinned?: boolean;
  
  // SEO & Metadata
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
  
  // Analytics
  views?: number;

  // Timestamps
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  publishedAt?: any | null; // Firestore Timestamp for 'blog'
  scheduledAt?: any | null;

  // --- New Platform-wide Fields ---
  sourcePlatform?: SourcePlatform;
  showInAuthorProfile?: boolean;

  // Site Publication Control
  allowSitePublication?: boolean;
  sitePublished?: boolean;
  sitePublishedAt?: any | null; // Firestore Timestamp for when a 'post' is published on site
  publishedBy?: string; // UID of admin/editor who published it

  // Editorial/Moderation Flow
  editorialStatus?: EditorialStatus;
  moderationNotes?: string;
  moderationUpdatedAt?: any | null;
  moderationUpdatedBy?: string; // UID of admin/moderator
  revisionRequested?: boolean;
  revisionMessage?: string;
  revisionSubmittedAt?: any | null;
};


export type Subcategory = {
  id: string;
  name: string;
};

export type BlogCategory = {
  id: string;
  name: string;
  subcategories: Subcategory[];
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
    categories: BlogCategory[];
    tags?: string[];
};

export type UserAccountStatus = 'active' | 'limited' | 'suspended' | 'banned';

export type ProfileMetrics = {
    customer?: {
        [subcategoryId: string]: {
            ratingAvg?: number;
            ratingCount?: number;
            platformRank?: number | null;
            completedCount?: number;
        }
    };
    professional?: {
        [subcategoryId: string]: {
            ratingAvg?: number;
            ratingCount?: number;
            platformRank?: number | null;
            completedCount?: number;
        }
    };
}

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
  coverUrl?: string;
  profileMetrics?: ProfileMetrics;
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

// --- Pro Page CMS Types ---

export type ProKnowYourCustomerBlock = {
  isActive: boolean;
  sectionTitle: string;
  sectionDescription: string;
  bullets: string[];
  cardTitle: string;
  imageUrl: string;
  imageAlt: string;
  cardPersonName: string;
  cardMetaText: string;
  cardRatingValue: number;
  cardCompletedSessions: number;
  cardTags: string[];
  updatedAt: any;
  updatedBy: string;
};

export type ProHowUsersSeeYouBlock = {
  isActive: boolean;
  sectionTitle: string;
  sectionDescription: string;
  imageUrl: string;
  imageAlt: string;
  cardPersonName: string;
  cardHeadline: string;
  cardLanguages: string;
  cardStatusLabel: string;
  cardDirections: string[];
  cardButtonLabel: string;
  updatedAt: any;
  updatedBy: string;
};

export type ProProfessionalsBlock = {
  isActive: boolean;
  sectionTitle: string;
  sectionDescription: string;
  updatedAt: any;
  updatedBy: string;
};

export type ProProfessionalItem = {
  id: string;
  isActive: boolean;
  sortOrder: number;
  name: string;
  roleLine: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  updatedAt: any;
  updatedBy: string;
};
