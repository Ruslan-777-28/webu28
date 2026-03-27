'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function Blog2ArticleRedirect() {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;

    useEffect(() => {
        if (slug) {
            router.replace(`/blog/${slug}`);
        } else {
            router.replace('/blog');
        }
    }, [router, slug]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                Завантаження матеріалу LECTOR...
            </div>
        </div>
    );
}
