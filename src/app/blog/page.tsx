import { Navigation } from '@/components/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogPage() {
  const categories = [
    { value: 'taro', label: 'таро' },
    { value: 'astrology', label: 'астрологія' },
    { value: 'shaman', label: 'шаман' },
    { value: 'retreat', label: 'ретрит' },
    { value: 'divination', label: 'гадання' },
    { value: 'numerology', label: 'нумерологія' },
  ];

  return (
    <main className="flex flex-col w-full min-h-screen bg-white text-foreground">
      <Navigation />
      <div className="w-full px-4 md:px-8 py-6">
        <Tabs defaultValue={categories[0].value} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value}>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder for news-style content */}
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">Пост 1: {category.label}</h3>
                  <p className="text-muted-foreground">Короткий опис поста. Тут буде текст, що анонсує статтю...</p>
                </div>
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">Пост 2: {category.label}</h3>
                  <p className="text-muted-foreground">Короткий опис поста. Тут буде текст, що анонсує статтю...</p>
                </div>
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">Пост 3: {category.label}</h3>
                  <p className="text-muted-foreground">Короткий опис поста. Тут буде текст, що анонсує статтю...</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
