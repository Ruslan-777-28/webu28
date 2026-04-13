'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { HomeHeroMediaSettings } from '@/lib/types';
import Link from 'next/link';

export function HomeStatusLink() {
    const [settings, setSettings] = useState<HomeHeroMediaSettings | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const docRef = doc(db, 'siteSettings', 'homeHeroMedia');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as HomeHeroMediaSettings);
                }
            } catch (error) {
                console.error("Error loading home status settings:", error);
            }
        };
        loadSettings();
    }, []);

    if (!settings || !settings.statusLinkImage?.isEnabled || !settings.statusLinkImage.imageUrl) {
        return null;
    }

    return (
        <div className="w-full mt-4 md:mt-4 mb-4 flex justify-end pr-8 md:pr-12 animate-in fade-in duration-1000">
            <Link 
                href={settings.statusLinkImage.targetUrl || '/status'} 
                className="opacity-50 hover:opacity-100 transition-opacity duration-700 outline-none block"
            >
                <img 
                    src={settings.statusLinkImage.imageUrl} 
                    alt={settings.statusLinkImage.alt || 'Status'} 
                    className="w-12 h-12 md:w-[58px] md:h-[58px] object-contain"
                />
            </Link>
        </div>
    );
}
