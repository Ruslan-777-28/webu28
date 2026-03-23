import { adminDb } from '@/lib/firebase/admin';
import type { BlogSettings, Subcategory } from '@/lib/types';

const newSubcategories: Subcategory[] = [
  { id: 'tarot', name: 'Tarot', slug: 'tarot', sortOrder: 1, isActive: true },
  { id: 'astrology', name: 'Astrology', slug: 'astrology', sortOrder: 2, isActive: true },
  { id: 'numerology', name: 'Numerology', slug: 'numerology', sortOrder: 3, isActive: true },
  { id: 'energy-healing', name: 'Energy Healing', slug: 'energy-healing', sortOrder: 4, isActive: true },
  { id: 'meditation-mindfulness', name: 'Meditation & Mindfulness', slug: 'meditation-mindfulness', sortOrder: 5, isActive: true },
  { id: 'spiritual-coaching', name: 'Spiritual Coaching', slug: 'spiritual-coaching', sortOrder: 6, isActive: true },
  { id: 'runes-oracle-systems', name: 'Runes & Oracle Systems', slug: 'runes-oracle-systems', sortOrder: 7, isActive: true },
  { id: 'dream-interpretation', name: 'Dream Interpretation', slug: 'dream-interpretation', sortOrder: 8, isActive: true },
  { id: 'human-design', name: 'Human Design', slug: 'human-design', sortOrder: 9, isActive: true },
  { id: 'space-cleansing-feng-shui', name: 'Space Cleansing & Feng Shui', slug: 'space-cleansing-feng-shui', sortOrder: 10, isActive: true },
  { id: 'mentors', name: 'Mentors', slug: 'mentors', sortOrder: 11, isActive: true },
];

async function seed() {
    try {
        console.log('Connecting to Firestore...');
        const ref = adminDb.collection('blogSettings').doc('main');
        const docSnap = await ref.get();
        
        let data = docSnap.exists ? (docSnap.data() as BlogSettings) : { categories: [] } as unknown as BlogSettings;
        if (!data.categories) {
            data.categories = [];
        }

        const esoIndex = data.categories.findIndex(c => c.id === 'esotericism' || c.slug === 'esotericism');

        if (esoIndex === -1) {
            console.log('Esotericism main category not found, adding it...');
            data.categories.push({
                id: 'esotericism',
                name: 'Esotericism',
                slug: 'esotericism',
                sortOrder: 1,
                isActive: true,
                subcategories: newSubcategories
            });
        } else {
            console.log('Esotericism main category found, merging subcategories...');
            const existingCat = data.categories[esoIndex];
            existingCat.slug = existingCat.slug || 'esotericism';
            existingCat.sortOrder = existingCat.sortOrder ?? 1;
            existingCat.isActive = existingCat.isActive ?? true;
            
            if (!existingCat.subcategories) {
                existingCat.subcategories = [];
            }
            
            for (const newSub of newSubcategories) {
                const subIndex = existingCat.subcategories.findIndex(s => s.id === newSub.id || s.slug === newSub.slug);
                if (subIndex === -1) {
                    existingCat.subcategories.push(newSub);
                } else {
                    existingCat.subcategories[subIndex] = {
                        ...existingCat.subcategories[subIndex],
                        slug: existingCat.subcategories[subIndex].slug || newSub.slug,
                        sortOrder: existingCat.subcategories[subIndex].sortOrder ?? newSub.sortOrder,
                        isActive: existingCat.subcategories[subIndex].isActive ?? newSub.isActive,
                    };
                }
            }
            existingCat.subcategories.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
        }

        console.log('Saving to Firestore...');
        await ref.update({ categories: data.categories });
        console.log('Success!');
        process.exit(0);
    } catch (error: any) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
}

seed();
