
'use client';

import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Skeleton } from '../ui/skeleton';

type SocialLink = {
    url: string;
    isActive: boolean;
};

type FooterSettings = {
    socialLinks: {
        [key: string]: SocialLink;
    };
};

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
        <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 122.77 122.77z" />
    </svg>
);

const socialIconMap: { [key: string]: React.ElementType } = {
    youtube: Youtube,
    facebook: Facebook,
    tiktok: TikTokIcon,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
};

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
        try {
            const settingsRef = doc(db, 'siteSettings', 'footer');
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as FooterSettings);
            }
        } catch (error) {
            console.error("Error loading footer settings:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchFooter();
  }, []);

  const informationLinks = [
    { href: '/info/community-rules', label: 'Правила спільноти' },
    { href: '/status', label: 'Статус' },
    { href: '/status/nominations', label: 'Вітрина номінацій' },
    { href: '/status/legend', label: 'Умовні позначки' },
    { href: '/status/hall-of-fame', label: 'Hall of Fame' },
    { href: '/status/archive', label: 'Архів статусів' },
    { href: '/info/contact', label: 'Контакти' },
    { href: '/info/privacy-policy', label: 'Privacy Policy' },
    { href: '/info/terms-of-use', label: 'Terms of Use' },
  ];

  const activeSocialLinks = settings?.socialLinks 
    ? Object.entries(settings.socialLinks).filter(([, value]) => value.isActive && value.url)
    : [];

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Left Column */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl font-bold text-accent">LECTOR</h3>
            <p className="text-sm max-w-xs text-sidebar-foreground/70">
              Глобальний простір знань, взаємодії та живої цінності.
            </p>
          </div>

          {/* Center Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-semibold tracking-wider uppercase text-sidebar-foreground/80">Інформація</h4>
            <ul className="space-y-2">
              {informationLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-sidebar-foreground/70 hover:text-accent transition-colors">
                      {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 space-y-4">
             <h4 className="font-semibold tracking-wider uppercase text-sidebar-foreground/80">Спільнота</h4>
             <div className="flex space-x-4">
                 {isLoading ? (
                    <div className="flex space-x-4"><Skeleton className="h-6 w-6" /><Skeleton className="h-6 w-6" /><Skeleton className="h-6 w-6" /></div>
                 ) : activeSocialLinks.length > 0 ? (
                    activeSocialLinks.map(([platform, link]) => {
                        const Icon = socialIconMap[platform];
                        return Icon ? (
                             <Link key={platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={platform} className="text-sidebar-foreground/70 hover:text-accent transition-colors">
                                <Icon className="h-5 w-5" />
                            </Link>
                        ) : null;
                    })
                 ) : (
                    <p className="text-sm text-sidebar-foreground/50">Соціальні мережі не налаштовані.</p>
                 )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-sidebar-foreground/50">
            © 2026 LECTOR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
