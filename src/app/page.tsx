import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Rocket, Zap, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: "Lightning Fast",
    description: "Built on modern technology for unparalleled speed and performance."
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Fully Responsive",
    description: "Looks great on all devices, from desktops to mobile phones."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Secure by Design",
    description: "Your data and privacy are our top priority with our robust security."
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-image-1");

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Welcome to Welcomely
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your new homepage, beautifully designed and ready to go. Explore the features and see what makes us special.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg">
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={650}
                  height={400}
                  className="mx-auto aspect-[16/10] overflow-hidden rounded-xl object-cover sm:w-full"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've packed Welcomely with features to make your experience seamless and enjoyable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center text-center gap-4 p-4">
                      <div className="bg-primary/10 p-4 rounded-full">
                          {feature.icon}
                      </div>
                      <div className="space-y-1">
                          <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                          <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
