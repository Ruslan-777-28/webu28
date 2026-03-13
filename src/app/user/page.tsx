import { Navigation } from '@/components/navigation';

export default function UserPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <Navigation />
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold">User Page</h1>
      </div>
    </main>
  );
}
