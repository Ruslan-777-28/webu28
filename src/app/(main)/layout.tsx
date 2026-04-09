'use client';

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';

/**
 * Main Layout for (main) route group.
 * This layout hosts all Firebase-dependent providers (AuthProvider).
 * Routes outside of this group (like /gate) will NOT trigger Firebase initialization.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </>
  );
}
