'use client';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AdminNav } from "@/components/admin-nav";
import { useUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // This effect runs on the client after hydration.
    // It checks if the user data has loaded and if the user has panel access.
    if (!loading && !profile?.adminAccess?.panelEnabled) {
      // If the user is not staff or doesn't have panel access enabled in their profile,
      // redirect them to the home page. This is a client-side guard for UI convenience.
      // Real security is enforced by Firestore/Storage rules using custom claims.
      router.replace('/');
    }
  }, [loading, profile, router]);


  // While loading or if the user doesn't have access, show a loading/access check message.
  // This prevents a flash of admin content before the redirect happens.
  if (loading || !profile?.adminAccess?.panelEnabled) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Checking access...</p>
      </div>
    );
  }

  // If the user has access, render the admin layout with navigation.
  return (
    <SidebarProvider>
      <Sidebar>
        <AdminNav />
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
