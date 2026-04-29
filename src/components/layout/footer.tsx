
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
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

  const informationLinksPlatform = [
    { href: '/info/community-rules', label: 'Правила спільноти' },
    { href: '/status', label: 'Статус' },
    { href: '/rewards', label: 'Система балів' },
    { href: '/trust-verification', label: 'Довіра і верифікація' },
    { href: '/status/legend', label: 'Умовні позначки' },
  ];

  const informationLinksLegal = [
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/referral-sprint-program', label: 'Referral Sprint Program' },
    { href: '/architectors', label: 'architectors' },
    { href: '/community-architects', label: 'Community Architects' },
    { href: '/contact', label: 'Контакти' },
    { href: '/info/privacy-policy', label: 'Privacy Policy' },
    { href: '/info/payouts', label: 'Вивід коштів' },
  ];

  const getLinkWithFrom = (href: string) => {
    if (!pathname || href.startsWith('http') || href.startsWith('mailto:')) return href;
    
    try {
        const url = new URL(href, 'https://placeholder.com');
        url.searchParams.set('from', pathname);
        // We only want the relative part
        return url.pathname + url.search + url.hash;
    } catch (e) {
        // Fallback for simple strings if URL parsing fails
        const separator = href.includes('?') ? '&' : '?';
        return `${href}${separator}from=${encodeURIComponent(pathname)}`;
    }
  };

  const activeSocialLinks = settings?.socialLinks 
    ? Object.entries(settings.socialLinks).filter(([, value]) => value.isActive && value.url)
    : [];

  return (
    <footer id="site-footer" className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4 flex flex-col">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-accent">LECTOR</h3>
              <p className="text-sm max-w-xs text-sidebar-foreground/70">
                Глобальний простір знань, взаємодії та живої цінності.
              </p>
            </div>
            <div className="pt-6 mt-auto">
              <Link href={getLinkWithFrom("/manifest")} className="text-xs uppercase tracking-[0.2em] font-medium text-sidebar-foreground/50 hover:text-accent transition-colors w-max">
                manifest
              </Link>
            </div>
          </div>

          {/* Info Column 1 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-semibold tracking-wider uppercase text-sidebar-foreground/80">Інформація</h4>
            <ul className="space-y-2">
              {informationLinksPlatform.map((link) => (
                <li key={link.label}>
                  <Link href={getLinkWithFrom(link.href)} className="text-sm text-sidebar-foreground/70 hover:text-accent transition-colors">
                      {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column 2 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-semibold tracking-wider uppercase text-sidebar-foreground/80">Ресурси</h4>
            <ul className="space-y-2">
              {informationLinksLegal.map((link) => (
                <li key={link.label}>
                  <Link href={getLinkWithFrom(link.href)} className="text-sm text-sidebar-foreground/70 hover:text-accent transition-colors">
                      {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-2 space-y-4">
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

        <div className="mt-4 md:-mt-1 flex flex-col sm:flex-row justify-start sm:items-end">
          <p className="text-[11px] sm:text-xs text-sidebar-foreground/50">
            © 2026 LECTOR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
