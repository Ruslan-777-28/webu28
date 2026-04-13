'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { HomeHeroMediaSettings } from '@/lib/types';
import Link from 'next/link';

export function FloatingStatusLink({ docId }: { docId: string }) {
    const [settings, setSettings] = useState<HomeHeroMediaSettings | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const docRef = doc(db, 'siteSettings', docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as HomeHeroMediaSettings);
                }
            } catch (error) {
                console.error(`Error loading status settings for ${docId}:`, error);
            }
        };
        loadSettings();
    }, [docId]);

    if (!settings || !settings.statusLinkImage?.isEnabled || !settings.statusLinkImage.imageUrl) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)] z-50 pointer-events-none">
            <Link 
                href={settings.statusLinkImage.targetUrl || '/status'} 
                className="pointer-events-auto flex items-center justify-center rounded-full bg-white border border-neutral-200 shadow-md transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-lg active:scale-95 w-[60px] h-[60px] md:w-[68px] md:h-[68px]"
                aria-label={settings.statusLinkImage.alt || 'Status'}
            >
                <img 
                    src={settings.statusLinkImage.imageUrl} 
                    alt={settings.statusLinkImage.alt || 'Status'} 
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
            </Link>
        </div>
    );
}
