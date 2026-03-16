'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, Shield, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile, UserAccountStatus } from '@/lib/types';
import { useState, useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const statusColors: Record<UserAccountStatus, string> = {
    active: 'bg-green-500',
    limited: 'bg-yellow-500',
    suspended: 'bg-orange-500',
    banned: 'bg-red-500',
};

const RoleBadge = ({ role, active }: { role: string, active: boolean }) => {
    if (!active) return null;
    const baseClasses = "text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full";
    const colors: { [key: string]: string } = {
        admin: "bg-red-100 text-red-800",
        editor: "bg-purple-100 text-purple-800",
        author: "bg-blue-100 text-blue-800",
        moderator: "bg-yellow-100 text-yellow-800",
        expert: "bg-green-100 text-green-800",
        user: "bg-gray-100 text-gray-800",
    };
    return <span className={`${baseClasses} ${colors[role] || colors.user}`}>{role}</span>;
};

export function UsersTable({ users, isLoading }: { users: UserProfile[], isLoading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const searchMatch = !searchTerm || 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.uid?.toLowerCase().includes(searchTerm.toLowerCase());

        const statusMatch = statusFilter === 'all' || (user.accountStatus || 'active') === statusFilter;
        
        const accessMatch = accessFilter === 'all' || 
            (accessFilter === 'staff' && user.adminAccess?.isStaff) ||
            (accessFilter === 'panel' && user.adminAccess?.panelEnabled);

        return searchMatch && statusMatch && accessMatch;
    });
  }, [users, searchTerm, statusFilter, accessFilter]);

  const renderSkeleton = () => (
    Array.from({ length: 8 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-48" /></TableCell>
        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ))
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={7} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
            <UserX className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No users match the current filters.</p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Input 
                placeholder="Search by name, email, or UID..." 
                className="max-w-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
            </Select>
            <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by access" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Access Levels</SelectItem>
                    <SelectItem value="staff">Any Staff Role</SelectItem>
                    <SelectItem value="panel">Panel Access</SelectItem>
                </SelectContent>
            </Select>
        </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin Access</TableHead>
              <TableHead>UID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeleton()
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    {user.roles && Object.entries(user.roles).map(([role, active]) => (
                        <RoleBadge key={role} role={role} active={active} />
                    ))}
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[user.accountStatus || 'active']}`} />
                        <span className="capitalize">{user.accountStatus || 'active'}</span>
                    </div>
                </TableCell>
                <TableCell>
                    {user.adminAccess?.panelEnabled && <Badge variant="secondary"><Shield className="w-3 h-3 mr-1"/> Panel</Badge>}
                </TableCell>
                <TableCell>
                    <code className="text-xs">{user.uid.substring(0, 8)}...</code>
                </TableCell>
                <TableCell>
                  {user.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                   <Link href={`/admin/users/${user.uid}`} passHref>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))
            ) : (
              renderEmptyState()
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
