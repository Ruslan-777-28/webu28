import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { BlogSettings } from '@/lib/types';

const blogSettingsData: BlogSettings = {
  blogPageTitle: "Блог про духовні практики",
  blogPageSubtitle: "Ідеї, практики, аналітика, поради та матеріали, які допомагають краще зрозуміти себе, знайти фахівця, інструмент або рішення.",
  heroDescription: "Досліджуйте статті, ідеї та експертні матеріали з екосистеми платформи.",
  heroPrimaryCtaLabel: "Читати статті",
  heroPrimaryCtaLink: "/blog",
  heroSecondaryCtaLabel: "Оглянути категорії",
  heroSecondaryCtaLink: "/blog#categories",
  featuredSectionTitle: "Рекомендоване",
  latestSectionTitle: "Останні статті",
  popularSectionTitle: "Найпопулярніше",
  categoriesSectionTitle: "Категорії",
  authorsSectionTitle: "Автори",
  subscribeTitle: "Будьте в курсі",
  subscribeDescription: "Отримуйте оновлення про нові статті та рекомендований контент.",
  seoTitle: "Блог про духовні практики | LECTOR",
  seoDescription: "Все про таро, астрологію, нумерологію та інші духовні практики.",
  ogImageUrl: "",
  canonicalUrl: "/blog",
  articlesPerPage: 9,
  defaultSort: "latest",
  showFeaturedSection: true,
  showPopularSection: true,
  showCategoriesSection: true,
  showAuthorsSection: false,
  showSubscribeBlock: true,
  categories: [
    { id: 'taro', name: 'Таро', subcategories: [
      { id: 'beginners', name: 'Для початківців' },
      { id: 'spreads', name: 'Розклади' },
    ]},
    { id: 'astrology', name: 'Астрологія', subcategories: [
      { id: 'forecasts', name: 'Прогнози' },
      { id: 'natal-chart', name: 'Натальна карта' },
    ]},
    { id: 'shamanism', name: 'Шаманізм', subcategories: [] },
    { id: 'retreat', name: 'Ретрит', subcategories: [] },
    { id: 'divination', name: 'Гадання', subcategories: [] },
    { id: 'numerology', name: 'Нумерологія', subcategories: [] },
    { id: 'practices', name: 'Практики', subcategories: [] },
    { id: 'advice', name: 'Поради', subcategories: [] },
  ],
  tags: ['самопізнання', 'стосунки', 'кар\'єра', 'енергія', 'медитація', 'майбутнє'],
};


export async function POST() {
    try {
        const ref = adminDb.collection('blogSettings').doc('main');
        
        await ref.set(blogSettingsData, { merge: true });
        
        return NextResponse.json({ success: true, message: 'Successfully seeded blogSettings/main document!' });
    } catch (error: any) {
        console.error('API seed error:', error);
        return NextResponse.json({ success: false, message: 'Error seeding database.', error: error.message }, { status: 500 });
    }
}
