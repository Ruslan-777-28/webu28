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

export type LikeType = 'post' | 'comment' | 'author';

export type Like = {
  id: string;
  uid: string;
  targetId: string;
  type: LikeType;
  createdAt: any;
};

export type FavoriteType = 'user' | 'post' | 'product';

export type Favorite = {
  id: string;
  uid: string;
  targetId: string;
  type: FavoriteType;
  createdAt: any;
};

export type Friendship = {
  id: string; // uid_friendUid
  ownerUid: string;
  friendUid: string;
  friendDisplayName?: string;
  friendAvatarUrl?: string;
  createdAt: any; // Firestore Timestamp
};

export type InternalShare = {
  id: string;
  senderUid: string;
  senderName: string;
  senderAvatarUrl?: string;
  targetUid: string;
  itemType: 'post' | 'profile';
  itemId: string; // slug or uid
  itemTitle?: string;
  itemUrl: string;
  message?: string;
  read: boolean;
  createdAt: any;
};


export type Comment = {
  id: string;
  uid: string;
  text: string;
  createdAt: any;
};


export type Subcategory = {
  id: string;
  name: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
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

export type Pricing = {
    ratePerMinute?: number;
    ratePerFile?: number;
    ratePerQuestion?: number;
    ratePerSession?: number;
    currency: string;
};

export type CommunicationOffer = {
    id: string;
    ownerId: string;
    type: 'video' | 'file' | 'text';
    schedulingType: 'instant' | 'scheduled';
    scheduledStart?: any;
    scheduledEnd?: any;
    durationMinutes?: number;
    categoryId: string;
    subcategoryId: string;
    pricing: Pricing;
    status: 'active' | 'inactive' | 'booked';
    createdAt: any;
    updatedAt: any;
};
export type VerificationLevel = 0 | 1 | 2 | 3 | 4;

export type PublicTrustState = 
  | "none"
  | "confirmed_account"
  | "verified_identity"
  | "active_professional"
  | "platform_verified";

export type ManualTrustOverride = {
  enabled: boolean;
  trustLevel: VerificationLevel | null;
  reason: string | null;
  setBy: string | null;
  setAt: import('firebase/firestore').Timestamp | null;
};

export type UserVerification = {
  trustLevel: VerificationLevel;
  publicTrustState: PublicTrustState;

  trustScore: number;
  riskLevel: "low" | "medium" | "high" | "blocked";

  emailVerified: boolean;
  phoneVerified: boolean;

  profileCompletionEligible: boolean;
  accountAgeDays: number;

  identityVerificationStatus: "none" | "pending" | "verified" | "rejected";

  payoutReadinessStatus: "not_required_yet" | "incomplete" | "pending_review" | "ready" | "blocked";

  completedPaidInteractions: number;
  activeProfessionalOffersCount: number;

  noModerationFlags: boolean;
  noRefundRisk: boolean;

  trustFlags: string[];
  trustReasons: string[];

  grantedAt: import('firebase/firestore').Timestamp | null;
  updatedAt: import('firebase/firestore').Timestamp | null;
  verificationSyncedAt: import('firebase/firestore').Timestamp | null;

  manualOverride?: ManualTrustOverride;
};

export type UserProfile = {
  uid: string;
  name: string;
  displayName?: string;
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
  bio?: string; // Legacy
  shortBio?: string;
  fullBio?: string;
  country?: string;
  timezone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  profileMetrics?: ProfileMetrics;
  preferredLanguage?: string;
  availability?: {
    status: 'available' | 'busy' | 'away';
    until?: import('firebase/firestore').Timestamp | null;
  };
  introVideoUrl?: string; // Author intro video
  introVideoPosterUrl?: string; // Poster for the video
  introVideoDurationSec?: number; // Duration of the video
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
  
  // --- Referral Sprint Fields ---
  referralCode?: string;
  usedReferralCode?: string;
  bonusBalance?: number;
  referralCreditsEarned?: number;

  // --- Trust & Verification Fields ---
  verification?: UserVerification;
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
  cardReviewsCount?: number; // New field
  cardTags: string[];
  reservedMinutes?: number; // New field
  reservedReward?: number; // New field
  rewardCurrencyLabel?: string; // New field
  translationEnabled?: boolean; // New field
  languagePair?: string; // New field
  countryCode?: string; // New field
  updatedAt: any;
  updatedBy: string;
};

export type ProInteractionType = 'text' | 'video' | 'file' | 'calendar';

export type ProInteraction = {
  type: ProInteractionType;
  topText: string;
  label: string;
  subLabel: string;
  isVisible: boolean;
};

export type ProPreviewModule = {
  title: string;
  subtitle: string;
  hint: string;
  isVisible: boolean;
};

export type ProHowUsersSeeYouBlock = {
  isActive: boolean;
  sectionTitle: string;
  sectionDescription: string;

  // Zone 1: Identity (Left)
  identity: {
    avatarImageUrl: string;
    displayName: string;
    statusLabel: string;
    headline: string;
    languages: string;
    metaLine: string;
    countryFlag?: string;
    countryCode?: string;
  };

  // Zone 2: Main (Center)
  specializations: string[]; // Max 4
  interactions: ProInteraction[]; // Fixed 3

  // Zone 3: Previews (Right)
  rightModules: {
    publications: ProPreviewModule;
    artifacts: ProPreviewModule;
    biography: ProPreviewModule;
  };

  updatedAt: any;
  updatedBy: string;

  // Legacy fields (for backward compatibility during migration)
  imageUrl?: string;
  imageAlt?: string;
  cardPersonName?: string;
  cardHeadline?: string;
  cardLanguages?: string;
  cardStatusLabel?: string;
  cardDirections?: string[];
  cardButtonLabel?: string;
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

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  showOnProPage: boolean;
  showOnCommunityPage: boolean;
  sortOrder: number;
  audience: 'professional' | 'community' | 'general';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  updatedBy: string; // UID of admin
}

// --- Homepage Settings Types ---

export type HomeHeroMediaSettings = {
  enabled: boolean;
  mediaType: 'video' | 'image';
  
  desktopVideoUrl?: string;
  desktopVideoPath?: string;
  
  mobileVideoUrl?: string;
  mobileVideoPath?: string;
  
  posterUrl?: string;
  posterPath?: string;
  
  imageUrl?: string;
  imagePath?: string;

  headline?: string;
  subheadline?: string;
  buttonLabel?: string;
  buttonLink?: string;
  secondaryTextBlock?: string;

  statusLinkImage?: {
    imageUrl: string;
    storagePath: string;
    alt: string;
    isEnabled: boolean;
    targetUrl: string;
  };

  updatedAt?: any; // Firestore Timestamp
  updatedBy?: string; // UID of admin
  version?: number;
};

export type Product = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId?: string;
  subcategoryId?: string;
  status: 'active' | 'inactive';
  imageUrl?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};

export type ReferralLink = {
  referredUid: string;
  referrerUid: string;
  codeUsed: string;
  status: 'linked';
  source: 'site_signup';
  signupBonusAwarded: boolean;
  activationBonusAwarded: boolean;
  createdAt: any; // Firestore Timestamp
};

export type BonusLedgerEntry = {
  uid: string;
  kind: 'referral_signup_bonus';
  amount: number;
  source: 'referral_program';
  referralId: string; // The referredUid
  createdAt: any;
};

export type AppNotification = {
  uid: string; // Target user
  channel: string; // e.g., 'user' | 'system'
  kind: string; // was 'type'
  title: string;
  body: string; // was 'message'
  readAt: any | null; // was 'read: boolean'
  createdAt: any;
  data?: any;
};

// --- Community Architect Governance ---

export type CommunityArchitectAssignment = {
  id: string; // Firestore document ID
  userId: string;
  countryCode: string;
  countryName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  publicTitle: string;
  publicStatement: string;
  isActive: boolean;
  isBlocked: boolean;
  blockReason: string | null;
  termStartAt: any; // Firestore Timestamp
  termEndAt: any; // Firestore Timestamp
  renewalCount: number;
  isFeatured: boolean;
  profileThemeEnabled: boolean;
  profileThemeMode: "custom" | "curated";
  profileThemeUrl: string | null;
  // Future-ready governance fields (not surfaced in v1 UI)
  councilEligible: boolean;
  futureEditorialScopeEnabled: boolean;
  assignedBy: string; // UID of admin
  assignedAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  blockedAt: any | null; // Firestore Timestamp
  blockedBy: string | null; // UID of admin who blocked
  notesInternal: string | null;
};

// --- Architect Council Governance ---

export type CouncilThreadType = 
  | "announcement" 
  | "idea" 
  | "launch_discussion" 
  | "local_initiative" 
  | "shortlist_nomination" 
  | "product_feedback" 
  | "internal_note";

export type CouncilThreadStatus = "open" | "in_review" | "planned" | "done" | "archived";

export type CouncilThread = {
  id: string;
  authorUid: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorCountryCode?: string;
  authorCountryName?: string;
  authorSubcategoryId?: string;
  authorSubcategoryName?: string;
  title: string;
  body: string;
  type: CouncilThreadType;
  tags: string[];
  status: CouncilThreadStatus;
  isPinned: boolean;
  isLocked: boolean;
  isAnnouncement: boolean;
  visibility: "council"; // Always 'council' in v1
  voteCount: number;
  commentCount: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  lastActivityAt: any; // Firestore Timestamp
  lastCommentAt?: any; // Firestore Timestamp
  lastCommentBy?: string; // UID
  councilContextCountryCode?: string;
  councilContextSubcategoryId?: string;
  createdByRole: "architect" | "admin";
};

export type CouncilComment = {
  id: string;
  threadId: string;
  authorUid: string;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  isDeleted: boolean;
};

export type CouncilVote = {
  id: string; // ${threadId}_${uid}
  threadId: string;
  uid: string;
  createdAt: any; // Firestore Timestamp
};

export type CouncilMember = {
  uid: string;
  isActive: boolean;
  isBlocked: boolean;
  councilEligible: boolean;
  roleTitle: string;
  countryCode: string;
  countryName: string;
  subcategoryId: string;
  subcategoryName: string;
  termEndAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
};
