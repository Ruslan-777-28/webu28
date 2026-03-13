import { Navigation } from '@/components/navigation';

export default function BlogPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <Navigation />
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold">Blog Page</h1>
      </div>
    </main>
  );
}
