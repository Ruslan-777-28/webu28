import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const navigationLinks = [
    { href: '/', label: 'Головна' },
    { href: '/pro', label: 'Для професіонала' },
    { href: '/user', label: 'Для спільноти' },
    { href: '/blog', label: 'Блог' },
  ];

  const informationLinks = [
    { href: '#', label: 'Про платформу' },
    { href: '#', label: 'Контакти' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Use' },
  ];

  const socialLinks = [
    { href: '#', icon: Twitter, name: 'Twitter' },
    { href: '#', icon: Instagram, name: 'Instagram' },
    { href: '#', icon: Linkedin, name: 'LinkedIn' },
  ];

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
            <h4 className="font-semibold tracking-wider uppercase text-sidebar-foreground/80">Навігація</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
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
        </div>

        <div className="mt-12 border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-sidebar-foreground/50 order-2 sm:order-1 mt-4 sm:mt-0">
            © 2026 LECTOR. All rights reserved.
          </p>
          <div className="flex space-x-4 order-1 sm:order-2">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href} aria-label={social.name} className="text-sidebar-foreground/50 hover:text-accent transition-colors">
                <social.icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
