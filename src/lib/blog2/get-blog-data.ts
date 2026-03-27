import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Post, BlogSettings, UserProfile } from '@/lib/types';
import { DEMO_POSTS, DemoPost } from './demo-blog2-data';

export interface Blog2Data {
    settings: BlogSettings | null;
    heroPost: (Post | DemoPost) | null;
    secondaryPosts: (Post | DemoPost)[];
    latestPosts: (Post | DemoPost)[];
    popularPosts: (Post | DemoPost)[];
    allPosts: (Post | DemoPost)[];
    spotlightAuthor: UserProfile | null;
    spotlightAuthorPosts: Post[];
}

export async function getBlog2Data(): Promise<Blog2Data> {
    try {
        // 1. Fetch Settings
        const settingsRef = doc(db, 'blogSettings', 'main');
        const settingsSnap = await getDoc(settingsRef);
        const settings = settingsSnap.exists() ? settingsSnap.data() as BlogSettings : null;

        // 2. Fetch Posts
        const blogPostsQuery = query(
            collection(db, "posts"), 
            where("contentType", "==", "blog"),
            where("status", "==", "published")
        );
        
        const userPostsQuery = query(
            collection(db, "posts"), 
            where("contentType", "==", "post"),
            where("sitePublished", "==", true)
        );

        const [blogSnap, userSnap] = await Promise.all([
            getDocs(blogPostsQuery),
            getDocs(userPostsQuery)
        ]);

        const blogPosts = blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        const userPosts = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

        console.log(`[Blog2Data] Fetched ${blogPosts.length} blog posts and ${userPosts.length} user posts.`);

        // Merge and sort
        const allPosts = [...blogPosts, ...userPosts]
            .sort((a, b) => {
                const getVal = (p: Post) => p.sitePublishedAt || p.publishedAt || p.createdAt;
                const dA = getVal(a);
                const dB = getVal(b);
                const dateA = dA?.toDate?.() || (dA instanceof Date ? dA : (typeof dA === 'object' && dA !== null ? dA : new Date(0)));
                const dateB = dB?.toDate?.() || (dB instanceof Date ? dB : (typeof dB === 'object' && dB !== null ? dB : new Date(0)));
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });

        // Unique real posts
        const realPosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());
        console.log(`[Blog2Data] Total unique real posts: ${realPosts.length}`);
        
        const combinedPosts: (Post | DemoPost)[] = [...realPosts];
        
        // Only append demo posts if real count is low
        if (realPosts.length < 10) {
            DEMO_POSTS.forEach(demo => {
                 if (!combinedPosts.find(p => p.id === demo.id)) {
                     combinedPosts.push(demo);
                 }
            });
        }

        // 3. Editorial Structure
        // Filter combined posts to prioritize real ones in all slices
        const realCount = realPosts.length;
        
        // Hero: find first with featured=true among REAL posts, else use absolute latest REAL
        const heroPost = realPosts.find(p => p.featured) 
            || realPosts[0] 
            || combinedPosts[0] || null;
        
        // Secondary: next 3 posts excluding hero (prefer real)
        const secondaryPosts = combinedPosts
            .filter(p => p.id !== heroPost?.id)
            .sort((a, b) => {
                const aIsDemo = 'isDemo' in a;
                const bIsDemo = 'isDemo' in b;
                if (aIsDemo && !bIsDemo) return 1;
                if (!aIsDemo && bIsDemo) return -1;
                return 0;
            })
            .slice(0, 3);
        
        // Latest: next 8 posts (prefer real)
        const latestPosts = combinedPosts
            .filter(p => p.id !== heroPost?.id && !secondaryPosts.find(sp => sp.id === p.id))
            .sort((a, b) => {
                const aIsDemo = 'isDemo' in a;
                const bIsDemo = 'isDemo' in b;
                if (aIsDemo && !bIsDemo) return 1;
                if (!aIsDemo && bIsDemo) return -1;
                return 0;
            })
            .slice(0, 8);

        // Popular: sort by views BUT keep real posts on top
        const popularPosts = combinedPosts
            .filter(p => p.id !== heroPost?.id)
            .sort((a, b) => {
                const aIsDemo = 'isDemo' in a;
                const bIsDemo = 'isDemo' in b;
                // If one is demo and other is not, non-demo wins
                if (aIsDemo && !bIsDemo) return 1;
                if (!aIsDemo && bIsDemo) return -1;
                // Otherwise sort by views
                return (b.views || 0) - (a.views || 0);
            })
            .slice(0, 5);

        // 4. Spotlight Author
        let spotlightAuthor: UserProfile | null = null;
        let spotlightAuthorPosts: Post[] = [];
        
        try {
            const authorsQuery = query(
                collection(db, "users"),
                where("roles.author", "==", true),
                limit(1)
            );
            const authorSnap = await getDocs(authorsQuery);
            
            if (authorSnap.docs.length > 0) {
                const d = authorSnap.docs[0];
                spotlightAuthor = { ...d.data(), uid: d.id } as UserProfile;
                
                // 5. Spotlight Author Posts — filtered from real posts only
                spotlightAuthorPosts = realPosts.filter(p => p.authorId === spotlightAuthor!.uid).slice(0, 3);
            }
        } catch (e) {
            console.warn("[Blog2Data] Spotlight author fetch failed (expected for guests):", e);
        }

        return {
            settings,
            heroPost,
            secondaryPosts,
            latestPosts,
            popularPosts,
            allPosts: combinedPosts,
            spotlightAuthor,
            spotlightAuthorPosts
        };
    } catch (error) {
        console.error("Error fetching blog-2 data:", error);
        return {
            settings: null,
            heroPost: null,
            secondaryPosts: [],
            latestPosts: [],
            popularPosts: [],
            allPosts: [],
            spotlightAuthor: null,
            spotlightAuthorPosts: []
        };
    }
}
