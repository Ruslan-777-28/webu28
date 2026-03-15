'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Users,
  Settings,
  Folder,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

const navItems = [
  { href: '/admin/blog', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/blog/categories', label: 'Categories', icon: Folder },
  // { href: '/admin/blog/tags', label: 'Tags', icon: Tags },
  // { href: '/admin/blog/authors', label: 'Authors', icon: Users },
  { href: '/admin/blog/settings', label: 'Settings', icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-sidebar-primary">
            AWE28
          </Link>
          {isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (pathname === item.href || (item.href !== '/admin/blog' && pathname.length > item.href.length))}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
