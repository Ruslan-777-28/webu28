import { Navigation } from '@/components/navigation';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Blog Page</h1>
      </main>
    </div>
  );
}
