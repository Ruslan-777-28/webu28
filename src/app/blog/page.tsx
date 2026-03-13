import { Navigation } from '@/components/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import React from 'react';

export default function BlogPage() {
  const categories = [
    { value: 'all', label: 'ALL' },
    { value: 'taro', label: 'таро' },
    { value: 'astrology', label: 'астрологія' },
    { value: 'shaman', label: 'шаман' },
    { value: 'retreat', label: 'ретрит' },
    { value: 'divination', label: 'гадання' },
    { value: 'numerology', label: 'нумерологія' },
  ];

  const postsByCategory = categories
    .filter((cat) => cat.value !== 'all')
    .reduce((acc, category) => {
      acc[category.value] = [
        { id: `${category.value}-1`, label: `Пост 1: ${category.label}` },
        { id: `${category.value}-2`, label: `Пост 2: ${category.label}` },
        { id: `${category.value}-3`, label: `Пост 3: ${category.label}` },
      ];
      return acc;
    }, {} as Record<string, {id: string, label: string}[]>);

  const allPosts = Object.values(postsByCategory).flat();

  return (
    <main className="flex flex-col w-full min-h-screen bg-white text-foreground">
      <Navigation />
      <div className="w-full px-4 md:px-8 py-6">
        <Tabs defaultValue={categories[0].value} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap border-b">
            <TabsList className="bg-transparent p-0 h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="bg-transparent text-muted-foreground shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          <TabsContent value="all">
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allPosts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 bg-card shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">{post.label}</h3>
                  <p className="text-muted-foreground">Короткий опис поста. Тут буде текст, що анонсує статтю...</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {Object.entries(postsByCategory).map(([categoryValue, posts]) => (
            <TabsContent key={categoryValue} value={categoryValue}>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <div key={post.id} className="border rounded-lg p-4 bg-card shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-card-foreground">{post.label.replace(/:.*$/, '')}</h3>
                    <p className="text-muted-foreground">Короткий опис поста. Тут буде текст, що анонсує статтю...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}