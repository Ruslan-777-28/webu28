import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';

/**
 * Main Layout for (main) route group.
 * This layout hosts all Firebase-dependent providers (AuthProvider).
 * Firebase Client initialization is now handled globally in the Root Layout 
 * via window.__FIREBASE_CONFIG__ and early module-level init.
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
