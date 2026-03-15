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
    if (!loading && !profile?.adminAccess?.panelEnabled) {
      // Redirect to home page if user is not staff or doesn't have panel access
      router.replace('/');
    }
  }, [loading, profile, router]);


  if (loading || !profile?.adminAccess?.panelEnabled) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Checking access...</p>
      </div>
    );
  }

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
