'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { useUser } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthModal } from '@/components/auth-modal';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { user, loading } = useUser();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const renderLoginButton = () => {
    // Show a skeleton while loading the auth state
    if (loading) {
      return <Skeleton className="h-12 w-32" />;
    }
    
    // Don't show the button if the user is logged in.
    if (user) {
      return null;
    }

    return (
      <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogTrigger asChild>
          <Button size="lg">Увійти</Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] sm:max-w-[425px]">
          <AuthModal setOpen={setAuthModalOpen} />
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation />
      <main className="flex-grow flex">
        <div className="w-4/5 flex items-center justify-center">
          {renderLoginButton()}
        </div>
        <div className="w-1/5 bg-muted/30 h-full">
          {/* This is the right-side block. Content can be added here later. */}
        </div>
      </main>
    </div>
  );
}
