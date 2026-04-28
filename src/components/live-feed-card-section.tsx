'use client';

import React, { useEffect, useState } from 'react';
import { CardSectionData } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { LayoutTemplate, ChevronLeft, ChevronRight } from 'lucide-react';



interface LiveFeedCardSectionProps {
  data: CardSectionData | null;
  fallbackTitle: string;
  fallbackSubtitle: string;
}

export function LiveFeedCardSection({ data, fallbackTitle, fallbackSubtitle }: LiveFeedCardSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // If data exists but is disabled, don't render anything
  if (data && data.enabled === false) {
    return null;
  }

  const title = data?.title || fallbackTitle;
  const subtitle = data?.subtitle || fallbackSubtitle;
  
  // Sort and filter active slides
  const slides = data?.carouselImages
    ? [...data.carouselImages]
        .filter(img => img.enabled)
        .sort((a, b) => a.order - b.order)
    : [];

  // If no slides, handle gracefully (could show empty or just return null depending on preferences)
  // The user requested: "якщо images відсутні, сторінка не повинна ламатися"
  // If there are no images, we can just show the section without the carousel, or a placeholder.
  // We'll show an empty premium container.

  // Determine active slide for the description block
  const activeIndex = current > 0 ? current - 1 : 0;
  const activeSlide = slides[activeIndex];

  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left Column: Text */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 order-1 text-center lg:text-left flex flex-col justify-center lg:pr-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:mb-8 tracking-tighter text-foreground text-balance leading-tight">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed text-balance max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
          </div>

          {/* Center Column: Premium Phone Mockup */}
          <div className="col-span-1 md:col-span-1 lg:col-span-4 order-2 flex justify-center items-center relative">
            <div className="relative flex items-center justify-center w-full max-w-[260px]">
             
              {/* Left Arrow (Desktop only) */}
              {count > 1 && (
                <button 
                  onClick={() => api?.scrollPrev()}
                  className="hidden md:flex absolute -left-12 lg:-left-16 z-20 w-10 h-10 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm hover:bg-muted hover:scale-105 transition-all text-muted-foreground hover:text-foreground"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 pr-0.5" />
                </button>
              )}

             <div className="relative w-full aspect-[9/19] rounded-[2rem] border-[8px] border-zinc-900 dark:border-zinc-800 bg-background shadow-2xl ring-1 ring-inset ring-white/10 overflow-hidden flex flex-col z-10">
                {/* Hardware details: modern dynamic island style notch */}
                <div className="absolute top-3 inset-x-0 h-6 flex justify-center z-20 pointer-events-none">
                    <div className="w-[32%] h-full bg-zinc-900/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-[inset_0px_-1px_1px_rgba(255,255,255,0.05)]"></div>
                </div>

                {slides.length > 0 ? (
                    <Carousel setApi={setApi} className="w-full h-full flex-1 relative">
                        <CarouselContent className="h-full ml-0">
                            {slides.map((slide, index) => (
                                <CarouselItem key={slide.id || index} className="pl-0 h-full w-full">
                                    <div className="w-full h-full relative bg-muted/5 flex items-center justify-center">
                                        <img 
                                            src={slide.imageUrl} 
                                            alt={slide.imageAlt || `Slide ${index + 1}`} 
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        
                        {/* Gradient overlay to ensure dots are readable */}
                        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />

                        {/* Dots Navigation */}
                        {count > 1 && (
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-20">
                                {Array.from({ length: count }).map((_, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all duration-300",
                                            current === index + 1 
                                                ? "bg-white w-5 opacity-100" 
                                                : "bg-white/40 w-1.5 hover:bg-white/60 hover:scale-110"
                                        )}
                                        onClick={() => api?.scrollTo(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </Carousel>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-muted/5">
                        <LayoutTemplate className="w-10 h-10 mb-4 opacity-10 text-foreground" strokeWidth={1} />
                        <span className="text-muted-foreground/40 text-xs font-medium uppercase tracking-widest">Feed Empty</span>
                    </div>
                )}
             </div>

              {/* Right Arrow (Desktop only) */}
              {count > 1 && (
                <button 
                  onClick={() => api?.scrollNext()}
                  className="hidden md:flex absolute -right-12 lg:-right-16 z-20 w-10 h-10 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm hover:bg-muted hover:scale-105 transition-all text-muted-foreground hover:text-foreground"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 pl-0.5" />
                </button>
              )}

            </div>
             
             {/* Decorative glow behind the phone */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/10 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
          </div>

          {/* Right Column: Active Slide Description */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3 order-3 flex flex-col justify-center lg:pl-4">
            {activeSlide && (activeSlide.label || activeSlide.title || activeSlide.description) && (
              <div 
                key={activeIndex} // This key forces a slight re-render/animation trigger
                className="flex flex-col space-y-3 bg-muted/20 lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none animate-in fade-in slide-in-from-right-4 duration-500"
              >
                {activeSlide.label && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                    {activeSlide.label}
                  </span>
                )}
                {activeSlide.title && (
                  <h4 className="text-base font-medium text-foreground">
                    {activeSlide.title}
                  </h4>
                )}
                {activeSlide.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {activeSlide.description}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
