'use client';

import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'value-exchange');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Welcome to Welcomely
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your new homepage, beautifully designed and ready to go. Explore what our platform has to offer.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/blog">
              <Button size="lg">Explore the Blog</Button>
            </Link>
            <Link href="/pro">
              <Button size="lg" variant="outline">
                Find Experts
              </Button>
            </Link>
          </div>
        </div>

        {heroImage && (
          <div className="container mx-auto px-4 my-16">
            <div className="relative aspect-video max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
