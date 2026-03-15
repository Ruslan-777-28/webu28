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
import { useUser } from '@/hooks/use-auth';

const allNavItems = [
  { href: '/admin/blog', label: 'Dashboard', icon: LayoutDashboard, roles: ['author', 'editor', 'admin'] },
  { href: '/admin/blog/articles', label: 'Articles', icon: Newspaper, roles: ['author', 'editor', 'admin'] },
  { href: '/admin/blog/categories', label: 'Categories', icon: Folder, roles: ['editor', 'admin'] },
  // { href: '/admin/blog/tags', label: 'Tags', icon: Tags, roles: ['editor', 'admin'] },
  // { href: '/admin/blog/authors', label: 'Authors', icon: Users, roles: ['editor', 'admin'] },
  { href: '/admin/blog/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export function AdminNav() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { profile } = useUser();

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!profile?.roles) return false;
    return allowedRoles.some(role => profile.roles[role as keyof typeof profile.roles]);
  };

  const visibleNavItems = allNavItems.filter(item => hasRole(item.roles));

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
          {visibleNavItems.map((item) => (
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
