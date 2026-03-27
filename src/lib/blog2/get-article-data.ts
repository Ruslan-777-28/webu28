import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Post, BlogSettings, UserProfile } from '@/lib/types';

export interface ArticleData {
    post: Post | null;
    author: UserProfile | null;
    relatedPosts: Post[];
    moreFromAuthor: Post[];
    settings: BlogSettings | null;
}

export async function getBlog2ArticleData(slug: string): Promise<ArticleData> {
    const empty: ArticleData = { post: null, author: null, relatedPosts: [], moreFromAuthor: [], settings: null };
    if (!slug) return empty;

    const postsRef = collection(db, 'posts');

    // ── 1. Fetch the article by slug ─────────────────────────────────────────
    // Uses the identical query pattern as the legacy /blog/post/[slug] route
    let post: Post | null = null;
    try {
        const blogQ = query(postsRef, where('slug', '==', slug), where('status', '==', 'published'));
        const blogSnap = await getDocs(blogQ);
        if (!blogSnap.empty) {
            const d = blogSnap.docs[0];
            post = { ...d.data(), id: d.id } as Post;
        }
    } catch (e) { /* ignore, try user post */ }

    if (!post) {
        try {
            const userQ = query(postsRef, where('slug', '==', slug), where('sitePublished', '==', true));
            const userSnap = await getDocs(userQ);
            if (!userSnap.empty) {
                const d = userSnap.docs[0];
                post = { ...d.data(), id: d.id } as Post;
            }
        } catch (e) { /* ignore */ }
    }

    if (!post) return empty;

    // ── 2. Fetch blog settings ────────────────────────────────────────────────
    let settings: BlogSettings | null = null;
    try {
        const settingsSnap = await getDoc(doc(db, 'blogSettings', 'main'));
        if (settingsSnap.exists()) settings = settingsSnap.data() as BlogSettings;
    } catch (e) { /* non-critical */ }

    // ── 3. Fetch author profile ───────────────────────────────────────────────
    let author: UserProfile | null = null;
    if (post.authorId) {
        try {
            const authorSnap = await getDoc(doc(db, 'users', post.authorId));
            if (authorSnap.exists()) author = { ...authorSnap.data(), uid: authorSnap.id } as UserProfile;
        } catch (e) { /* non-critical */ }
    }

    // ── 4. More from this author ──────────────────────────────────────────────
    // Only use sitePublished=true which is the same condition used in getBlog2Data
    let moreFromAuthor: Post[] = [];
    if (post.authorId) {
        try {
            const moreQ = query(postsRef, where('authorId', '==', post.authorId), where('sitePublished', '==', true));
            const moreSnap = await getDocs(moreQ);
            moreFromAuthor = moreSnap.docs
                .map(d => ({ ...d.data(), id: d.id } as Post))
                .filter(p => p.id !== post!.id)
                .slice(0, 3);
        } catch (e) { /* non-critical — recirculation is optional */ }
    }

    // ── 5. Related posts by subcategory or category ───────────────────────────
    let relatedPosts: Post[] = [];
    if (post.subcategoryId) {
        try {
            const relQ = query(postsRef, where('subcategoryId', '==', post.subcategoryId), where('sitePublished', '==', true));
            const relSnap = await getDocs(relQ);
            relatedPosts = relSnap.docs
                .map(d => ({ ...d.data(), id: d.id } as Post))
                .filter(p => p.id !== post!.id)
                .slice(0, 4);
        } catch (e) { /* non-critical */ }
    }

    if (relatedPosts.length < 2 && post.categoryId) {
        try {
            const relQ2 = query(postsRef, where('categoryId', '==', post.categoryId), where('sitePublished', '==', true));
            const relSnap2 = await getDocs(relQ2);
            const extras = relSnap2.docs
                .map(d => ({ ...d.data(), id: d.id } as Post))
                .filter(p => p.id !== post!.id && !relatedPosts.find(r => r.id === p.id));
            relatedPosts = [...relatedPosts, ...extras].slice(0, 4);
        } catch (e) { /* non-critical */ }
    }

    // Also try finding editorial blog posts by categoryId (status=published)
    if (relatedPosts.length < 2 && post.categoryId) {
        try {
            const editorialQ = query(postsRef, where('categoryId', '==', post.categoryId), where('status', '==', 'published'));
            const editorialSnap = await getDocs(editorialQ);
            const extras = editorialSnap.docs
                .map(d => ({ ...d.data(), id: d.id } as Post))
                .filter(p => p.id !== post!.id && !relatedPosts.find(r => r.id === p.id));
            relatedPosts = [...relatedPosts, ...extras].slice(0, 4);
        } catch (e) { /* non-critical */ }
    }

    return { post, author, relatedPosts, moreFromAuthor, settings };
}
