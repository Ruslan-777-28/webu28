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
  const { profile, claims, loading } = useUser();
  const router = useRouter();

  const isStaff = claims?.admin || claims?.editor || claims?.author || claims?.moderator;

  useEffect(() => {
    // This effect runs on the client after hydration.
    // It checks if the user data has loaded and if the user has panel access.
    if (!loading && (!isStaff || !profile?.adminAccess?.panelEnabled)) {
      // Real security is enforced by Firestore/Storage rules using custom claims.
      // This is a client-side guard for UI convenience.
      router.replace('/');
    }
  }, [loading, profile, isStaff, router]);


  // While loading or if the user doesn't have access, show a loading/access check message.
  // This prevents a flash of admin content before the redirect happens.
  if (loading || !isStaff || !profile?.adminAccess?.panelEnabled) {
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
