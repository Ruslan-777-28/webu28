export type ArticleStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: ArticleStatus;
  author: {
      name: string;
      avatarUrl?: string;
  };
  category: {
      id: string;
      name: string;
  };
  featured: boolean;
  publishedAt: string; // Using string for simplicity in placeholder
  updatedAt: string;
  coverImageUrl: string;
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
    seoTitle?: string;
    seoDescription?: string;
    articlesPerPage: number;
    showFeaturedSection: boolean;
    showPopularSection: boolean;
}

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  preferredLanguage?: string;
  availability?: {
    status: 'available' | 'busy' | 'away';
    until?: import('firebase/firestore').Timestamp | null;
  };
  createdAt: import('firebase/firestore').Timestamp;
};
