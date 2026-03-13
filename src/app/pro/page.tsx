import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <Navigation />
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Experts</h1>
        <p className="text-muted-foreground mb-8">This is where the experts' profiles will be displayed.</p>
        <Link href="/admin/blog">
          <Button>Go to Blog Admin</Button>
        </Link>
      </div>
    </main>
  );
}
