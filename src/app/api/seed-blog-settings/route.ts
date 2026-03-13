import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

const blogSettingsData = {
  blogPageTitle: "Blog",
  blogPageSubtitle: "Insights, articles, and guidance",
  heroDescription: "Explore articles, ideas, and expert materials from the platform ecosystem.",
  heroPrimaryCtaLabel: "Read Articles",
  heroPrimaryCtaLink: "/blog",
  heroSecondaryCtaLabel: "Explore Categories",
  heroSecondaryCtaLink: "/blog#categories",
  featuredSectionTitle: "Featured",
  latestSectionTitle: "Latest Articles",
  popularSectionTitle: "Popular",
  categoriesSectionTitle: "Categories",
  authorsSectionTitle: "Authors",
  subscribeTitle: "Stay Updated",
  subscribeDescription: "Get updates about new articles and featured content.",
  seoTitle: "Blog",
  seoDescription: "Articles, insights, and expert content from our platform.",
  canonicalUrl: "/blog",
  articlesPerPage: 9,
  defaultSort: "latest",
  showFeaturedSection: true,
  showPopularSection: true,
  showCategoriesSection: true,
  showAuthorsSection: false,
  showSubscribeBlock: true
};

export async function POST() {
    try {
        const ref = adminDb.collection('blogSettings').doc('main');
        
        // Using set with merge: true makes the operation idempotent.
        // It will create the document if it doesn't exist, or update it if it does.
        await ref.set(blogSettingsData, { merge: true });
        
        return NextResponse.json({ success: true, message: 'Successfully seeded blogSettings/main document!' });
    } catch (error: any) {
        console.error('API seed error:', error);
        return NextResponse.json({ success: false, message: 'Error seeding database.', error: error.message }, { status: 500 });
    }
}
