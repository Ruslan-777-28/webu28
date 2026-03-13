import { Navigation } from '@/components/navigation';

export default function ProPage() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <Navigation />
      <div className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold">Experts</h1>
      </div>
    </main>
  );
}
