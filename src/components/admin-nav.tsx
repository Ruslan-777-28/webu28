'use client';

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Newspaper,
  Folder,
  Settings,
  Languages,
  Users,
  ExternalLink,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/use-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allNavItems = [
  { href: '/admin/users', label: 'Users', icon: Users, roles: ['moderator', 'admin'] },
  { href: '/admin/publication-queue', label: 'Publication Queue', icon: Inbox, roles: ['moderator', 'editor', 'admin'] },
  { href: '/admin/blog', label: 'Blog Dashboard', icon: LayoutDashboard, roles: ['author', 'editor', 'admin'] },
  { href: '/admin/blog/articles', label: 'Articles', icon: Newspaper, roles: ['author', 'editor', 'admin'] },
  { href: '/admin/blog/categories', label: 'Categories', icon: Folder, roles: ['editor', 'admin'] },
  { href: '/admin/blog/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export function AdminNav() {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const { claims } = useUser();

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!claims) return false;
    return allowedRoles.some(role => claims[role]);
  };

  const visibleNavItems = allNavItems.filter(item => hasRole(item.roles));

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="font-bold text-lg text-sidebar-primary">
            LECTOR Admin
          </Link>
          {isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
           <SidebarMenuItem>
            <Link href="/" legacyBehavior passHref>
              <SidebarMenuButton asChild tooltip="Перейти на сайт">
                <a>
                  <ExternalLink />
                  <span>Перейти на сайт</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarSeparator />
          {visibleNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
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
      <SidebarFooter>
        {state === 'expanded' && (
           <Select defaultValue="uk">
              <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Languages />
                    <SelectValue placeholder="Мова" />
                  </div>
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="uk">Українська</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
              </SelectContent>
          </Select>
        )}
      </SidebarFooter>
    </>
  );
}
