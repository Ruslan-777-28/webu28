import { Navigation } from '@/components/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import React from 'react';
import { Search, Clock, User, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Using a component for article card to avoid repetition and for clarity
const ArticleCard = ({ post, className, isFeatured = false }: { post: any, className?: string, isFeatured?: boolean }) => (
  <Card className={cn("overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300", className)}>
    <div className="relative w-full">
      <Image 
        src={post.image} 
        alt={post.title} 
        width={isFeatured ? 800 : 400} 
        height={isFeatured ? 450 : 225} 
        className="w-full object-cover aspect-video" 
      />
    </div>
    <CardContent className="p-4 flex flex-col flex-grow">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{post.category}</Badge>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
      </div>
      <h3 className={cn("font-bold mb-2 text-card-foreground leading-tight", isFeatured ? "text-2xl" : "text-xl")}>{post.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{post.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
      </div>
    </CardContent>
  </Card>
);

const CompactArticleCard = ({ post, className }: { post: any, className?: string }) => (
    <Card className={cn("overflow-hidden flex items-center h-full shadow-md hover:shadow-xl transition-shadow duration-300", className)}>
        <div className="relative w-1/3">
            <Image src={post.image} alt={post.title} width={150} height={100} className="w-full h-full object-cover aspect-video"/>
        </div>
        <CardContent className="p-3 w-2/3">
            <Badge variant="outline" className="text-xs mb-1">{post.category}</Badge>
            <h4 className="font-bold text-sm mb-1 leading-tight line-clamp-2">{post.title}</h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            </div>
        </CardContent>
    </Card>
);

export default function BlogPage() {
  const categories = [
    { value: 'all', label: 'ВСІ' },
    { value: 'taro', label: 'таро' },
    { value: 'astrology', label: 'астрологія' },
    { value: 'shaman', label: 'шаман' },
    { value: 'retreat', label: 'ретрит' },
    { value: 'divination', label: 'гадання' },
    { value: 'numerology', label: 'нумерологія' },
    { value: 'practices', label: 'Практики' },
    { value: 'advice', label: 'Поради' },
    { value: 'analytics', label: 'Аналітика' },
  ];

  const posts = [
    { id: 1, title: 'Як читати карти Таро: Посібник для початківців', description: 'Відкрийте для себе світ Таро та навчіться інтерпретувати карти для особистого розвитку та самопізнання.', category: 'таро', date: '15.07.2024', author: 'Олена П.', readTime: '8 хв', image: 'https://picsum.photos/seed/taro1/800/450' },
    { id: 2, title: 'Астрологічний прогноз на серпень 2024', description: 'Що зірки готують для вашого знаку зодіаку в кінці літа? Детальний аналіз від нашого астролога.', category: 'астрологія', date: '14.07.2024', author: 'Максим К.', readTime: '12 хв', image: 'https://picsum.photos/seed/astro1/400/225' },
    { id: 3, title: 'Сила шаманських практик для сучасної людини', description: 'Подорож до витоків давніх знань, які допомагають знайти гармонію та зв\'язок з природою.', category: 'шаман', date: '12.07.2024', author: 'Анонім', readTime: '10 хв', image: 'https://picsum.photos/seed/shaman1/400/225' },
    { id: 4, title: 'Цифрова нумерологія: значення чисел у вашому житті', description: 'Як дата народження та ім\'я впливають на вашу долю. Розкрийте таємниці чисел.', category: 'нумерологія', date: '10.07.2024', author: 'Ірина В.', readTime: '7 хв', image: 'https://picsum.photos/seed/numero1/400/225' },
    { id: 5, title: 'Ретрит тиші: досвід повного занурення в себе', description: 'Що відбувається, коли ви відмовляєтесь від зовнішнього шуму? Особиста історія та поради.', category: 'ретрит', date: '08.07.2024', author: 'Сергій Л.', readTime: '9 хв', image: 'https://picsum.photos/seed/retreat1/400/225' },
    { id: 6, title: 'Гадання на кавовій гущі: мистецтво бачити майбутнє', description: 'Старовинна практика ворожіння, яка не втрачає актуальності. Вчимося разом.', category: 'гадання', date: '05.07.2024', author: 'Марія Д.', readTime: '6 хв', image: 'https://picsum.photos/seed/divine1/400/225' },
  ];

  const featuredPost = posts[0];
  const recommendedPosts = posts.slice(1, 4); // 3 recommended posts
  const popularPosts = posts.slice(0, 5);

  return (
    <main className="flex flex-col w-full min-h-screen bg-white text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 md:px-6 py-6">

        {/* Hero Block */}
        <section className="text-center py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">Блог про духовні практики</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    Ідеї, практики, аналітика, поради та матеріали, які допомагають краще зрозуміти себе, знайти фахівця, інструмент або рішення.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg">Читати останні статті</Button>
                    <Button size="lg" variant="outline">Перейти до категорій</Button>
                </div>
            </div>
        </section>

        {/* Featured/Recommended Block */}
        <section className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Рекомендоване</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <ArticleCard post={featuredPost} isFeatured={true} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    {recommendedPosts.map(post => <CompactArticleCard key={post.id} post={post} />)}
                </div>
            </div>
        </section>

        {/* Search, Categories and Main Feed */}
        <section className="my-12">
            <Tabs defaultValue={categories[0].value} className="w-full">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 border-b pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div className="relative flex-grow w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input type="search" placeholder="Пошук по статтях..." className="pl-10 w-full md:w-80"/>
                    </div>
                    <ScrollArea className="w-full md:flex-1 whitespace-nowrap">
                        <TabsList className="bg-transparent p-0 h-auto gap-4 justify-start">
                        {categories.map((category) => (
                            <TabsTrigger key={category.value} value={category.value} className="bg-transparent text-muted-foreground shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none px-2 pb-2">
                            {category.label}
                            </TabsTrigger>
                        ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                
                <TabsContent value="all" className="mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl font-bold mb-6">Останні публікації</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {posts.map(post => <ArticleCard key={post.id} post={post} />)}
                            </div>
                            <div className="flex justify-center mt-12">
                                <Button variant="outline">Показати ще</Button>
                            </div>
                        </div>
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28">
                                <h3 className="text-2xl font-bold mb-4">Найчитаніше</h3>
                                <div className="flex flex-col gap-4">
                                    {popularPosts.map((post, index) => (
                                        <div key={post.id} className="flex items-start gap-4 group">
                                            <span className="text-3xl font-bold text-muted-foreground/30 w-8 text-center pt-1 group-hover:text-primary transition-colors">{index + 1}</span>
                                            <div>
                                                <h4 className="font-semibold leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                                                <p className="text-sm text-muted-foreground">{post.author} · {post.readTime}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </TabsContent>

                {categories.filter(c => c.value !== 'all').map(cat => (
                     <TabsContent key={cat.value} value={cat.value} className="mt-8">
                        <h2 className="text-3xl font-bold mb-6">Статті в категорії "{cat.label}"</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.filter(p => p.category === cat.label.toLowerCase() || p.category === cat.value).map(post => (
                                <ArticleCard key={post.id} post={post} />
                            ))}
                        </div>
                         {posts.filter(p => p.category === cat.label.toLowerCase() || p.category === cat.value).length > 5 &&
                            <div className="flex justify-center mt-12">
                                <Button variant="outline">Показати ще</Button>
                            </div>
                         }
                    </TabsContent>
                ))}

            </Tabs>
        </section>

        {/* Subscription Block */}
        <section className="my-20 bg-muted/50 rounded-lg p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-2">Отримуйте нові матеріали першими</h2>
                <p className="text-muted-foreground mb-6">Практичні статті, корисні добірки та нові ідеї без зайвого шуму.</p>
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                    <Input type="email" placeholder="Ваш email" className="bg-background" />
                    <Button>Підписатися</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Ми поважаємо вашу приватність і не надсилаємо спам.</p>
            </div>
        </section>

      </div>
    </main>
  );
}
