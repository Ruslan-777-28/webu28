'use client';
import { Navigation } from '@/components/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Clock, User, Calendar, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreatePostModal } from '@/components/create-post-modal';
import Footer from '@/components/layout/footer';
import type { Post, BlogSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- MOCK DATA ---

const mockSettings: BlogSettings = {
  blogPageTitle: "Блог про духовні практики",
  blogPageSubtitle: "Ідеї, практики, аналітика, поради та матеріали, які допомагають краще зрозуміти себе, знайти фахівця, інструмент або рішення.",
  featuredSectionTitle: "Рекомендоване",
  articlesPerPage: 9,
  defaultSort: 'latest',
  showFeaturedSection: true,
  showPopularSection: true,
  showCategoriesSection: true,
  showAuthorsSection: false,
  showSubscribeBlock: true,
  subscribeTitle: "Будьте в курсі",
  subscribeDescription: "Отримуйте оновлення про нові статті та рекомендований контент.",
  categories: [
    { id: 'taro', name: 'Таро', subcategories: [
      { id: 'beginners', name: 'Для початківців' },
      { id: 'spreads', name: 'Розклади' },
    ]},
    { id: 'astrology', name: 'Астрологія', subcategories: [
      { id: 'forecasts', name: 'Прогнози' },
      { id: 'natal-chart', name: 'Натальна карта' },
    ]},
     { id: 'practices', name: 'Практики', subcategories: [] },
  ],
};

const mockPosts: Post[] = [
    {
        id: '1',
        title: 'Як почати працювати з картами Таро: гід для новачків',
        excerpt: 'Все, що потрібно знати, щоб зробити свій перший розклад. Від вибору колоди до тлумачення карт.',
        coverImageUrl: 'https://picsum.photos/seed/taro1/800/450',
        authorName: 'Олена Таро',
        publishedAt: { toDate: () => new Date('2024-05-15') },
        createdAt: { toDate: () => new Date('2024-05-15') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.repeat(2),
        categoryId: 'taro',
        subcategoryId: 'beginners',
        slug: 'taro-for-beginners',
        contentType: 'blog',
        status: 'published',
        authorId: 'author1',
    },
    {
        id: '2',
        title: 'Астрологічний прогноз на червень: що готують нам зірки?',
        excerpt: 'Детальний розбір впливу планет на кожен знак зодіаку. Поради, як використати цей час з користю.',
        coverImageUrl: 'https://picsum.photos/seed/astro1/800/450',
        authorName: 'Сергій Астролог',
        publishedAt: { toDate: () => new Date('2024-05-14') },
        createdAt: { toDate: () => new Date('2024-05-14') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.repeat(3),
        categoryId: 'astrology',
        subcategoryId: 'forecasts',
        slug: 'astro-forecast-june',
        contentType: 'blog',
        status: 'published',
        authorId: 'author2',
    },
    {
        id: '3',
        title: 'Розклад "Кельтський хрест": глибокий аналіз ситуації',
        excerpt: 'Покрокова інструкція для одного з найпопулярніших та найглибших розкладів Таро. Розкрийте всі аспекти вашого питання.',
        coverImageUrl: 'https://picsum.photos/seed/taro2/800/450',
        authorName: 'Олена Таро',
        publishedAt: { toDate: () => new Date('2024-05-12') },
        createdAt: { toDate: () => new Date('2024-05-12') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.repeat(2.5),
        categoryId: 'taro',
        subcategoryId: 'spreads',
        slug: 'celtic-cross-spread',
        contentType: 'blog',
        status: 'published',
        authorId: 'author1',
    },
    {
        id: '4',
        title: 'Натальна карта: ключ до розуміння себе',
        excerpt: 'Що таке натальна карта і як вона допомагає розкрити свій потенціал, сильні та слабкі сторони.',
        coverImageUrl: 'https://picsum.photos/seed/astro2/800/450',
        authorName: 'Сергій Астролог',
        publishedAt: { toDate: () => new Date('2024-05-10') },
        createdAt: { toDate: () => new Date('2024-05-10') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.repeat(4),
        categoryId: 'astrology',
        subcategoryId: 'natal-chart',
        slug: 'natal-chart-guide',
        contentType: 'blog',
        status: 'published',
        authorId: 'author2',
    },
    {
        id: '5',
        title: 'Ранкові медитації для енергії та спокою',
        excerpt: 'Пʼять простих, але дієвих практик, які допоможуть налаштуватися на продуктивний та гармонійний день.',
        coverImageUrl: 'https://picsum.photos/seed/pract1/800/450',
        authorName: 'Анна Практик',
        publishedAt: { toDate: () => new Date('2024-05-08') },
        createdAt: { toDate: () => new Date('2024-05-08') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'.repeat(1),
        categoryId: 'practices',
        subcategoryId: '',
        slug: 'morning-meditations',
        contentType: 'blog',
        status: 'published',
        authorId: 'author3',
    },
    {
        id: '6',
        title: 'Як обрати свою першу колоду Таро?',
        excerpt: 'Райдер-Уейт, Тота, Марсельське Таро чи авторська колода? Допоможемо розібратися у різноманітті та знайти те, що підходить саме вам.',
        coverImageUrl: 'https://picsum.photos/seed/taro3/800/450',
        authorName: 'Олена Таро',
        publishedAt: { toDate: () => new Date('2024-05-05') },
        createdAt: { toDate: () => new Date('2024-05-05') },
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'.repeat(2.8),
        categoryId: 'taro',
        subcategoryId: 'beginners',
        slug: 'choose-first-tarot-deck',
        contentType: 'blog',
        status: 'published',
        authorId: 'author1',
    },
];

// --- END MOCK DATA ---


const ArticleCard = ({ post, categoryName, subcategoryName, className, isFeatured = false }: { post: Post, categoryName: string, subcategoryName: string, className?: string, isFeatured?: boolean }) => (
  <Card className={cn("overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300", className)}>
    <div className="relative w-full">
      <Image 
        src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/800/450"} 
        alt={post.title} 
        width={isFeatured ? 800 : 400} 
        height={isFeatured ? 450 : 225} 
        className="w-full object-cover aspect-video" 
      />
    </div>
    <CardContent className="p-4 flex flex-col flex-grow">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{subcategoryName ? `${categoryName} / ${subcategoryName}`: categoryName}</Badge>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt?.toDate().toLocaleDateString() || post.createdAt?.toDate().toLocaleDateString()}</span>
      </div>
      <h3 className={cn("font-bold mb-2 text-card-foreground leading-tight", isFeatured ? "text-2xl" : "text-xl")}>{post.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.authorName}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.ceil((post.content?.split(' ').length || 0) / 200)} хв</span>
      </div>
    </CardContent>
  </Card>
);

export default function BlogPage() {
  const [settings, setSettings] = useState<BlogSettings | null>(mockSettings);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all' || !settings) return [];
    const category = settings.categories.find(c => c.id === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory, settings]);

  useEffect(() => {
    setSelectedSubcategory('all');
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
        const categoryMatch = selectedCategory === 'all' || post.categoryId === selectedCategory;
        const subcategoryMatch = selectedCategory === 'all' || selectedSubcategory === 'all' || post.subcategoryId === selectedSubcategory;
        const searchMatch = searchTerm === '' || post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [posts, selectedCategory, selectedSubcategory, searchTerm]);

  const getCategoryName = (categoryId: string) => settings?.categories.find(c => c.id === categoryId)?.name || categoryId;
  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
      const category = settings?.categories.find(c => c.id === categoryId);
      return category?.subcategories?.find(s => s.id === subcategoryId)?.name || subcategoryId;
  }

  if (isLoading) {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <Navigation />
            <div className="container mx-auto px-4 md:px-6 py-6 flex-grow">
                <Skeleton className="h-48 w-full mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            </div>
            <Footer />
        </div>
    );
  }

  const featuredPost = posts[0];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 md:px-6 py-6 flex-grow">

        <section className="text-center py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">{settings?.blogPageTitle || 'Блог'}</h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                    {settings?.blogPageSubtitle}
                </p>
            </div>
        </section>

        {settings?.showFeaturedSection && featuredPost && (
             <section className="my-12">
                <h2 className="text-3xl font-bold mb-6 text-center md:text-left">{settings.featuredSectionTitle || 'Рекомендоване'}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <ArticleCard 
                        post={featuredPost} 
                        categoryName={getCategoryName(featuredPost.categoryId)}
                        subcategoryName={featuredPost.subcategoryId ? getSubcategoryName(featuredPost.categoryId, featuredPost.subcategoryId) : ''}
                        isFeatured={true} 
                    />
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {posts.slice(1, 4).map(post => (
                            <Card key={post.id} className="overflow-hidden flex items-center h-full shadow-md hover:shadow-xl transition-shadow duration-300">
                                <div className="relative w-1/3">
                                    <Image src={post.coverImageUrl || "https://picsum.photos/seed/placeholder/150/100"} alt={post.title} width={150} height={100} className="w-full h-full object-cover aspect-video"/>
                                </div>
                                <CardContent className="p-3 w-2/3">
                                    <Badge variant="outline" className="text-xs mb-1">{getCategoryName(post.categoryId)}</Badge>
                                    <h4 className="font-bold text-sm mb-1 leading-tight line-clamp-2">{post.title}</h4>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        )}

        <section className="my-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b pb-4 sticky top-16 bg-background/95 backdrop-blur-sm z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="relative w-full md:w-auto md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Пошук по статтях..." 
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Категорія" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі категорії</SelectItem>
                            {settings?.categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={availableSubcategories.length === 0}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Підкатегорія" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі підкатегорії</SelectItem>
                             {availableSubcategories.map(sub => (
                                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {filteredPosts.map(post => (
                        <ArticleCard 
                            key={post.id} 
                            post={post} 
                            categoryName={getCategoryName(post.categoryId)}
                            subcategoryName={post.subcategoryId ? getSubcategoryName(post.categoryId, post.subcategoryId) : ''}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <XCircle className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold">Статей не знайдено</h3>
                    <p>Спробуйте змінити фільтри або пошуковий запит.</p>
                </div>
            )}
            
            {/* Pagination could go here */}
        </section>

        <section className="my-20 text-center">
            <Dialog open={isPostModalOpen} onOpenChange={setPostModalOpen}>
                <DialogTrigger asChild>
                    <Button size="lg">хочу опублікувати контент</Button>
                </DialogTrigger>
                <CreatePostModal setOpen={setPostModalOpen} />
            </Dialog>
        </section>

        {settings?.showSubscribeBlock && (
            <section className="my-20 bg-muted/50 rounded-lg p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-2">{settings.subscribeTitle || 'Отримуйте нові матеріали першими'}</h2>
                    <p className="text-muted-foreground mb-6">{settings.subscribeDescription || 'Практичні статті, корисні добірки та нові ідеї без зайвого шуму.'}</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                        <Input type="email" placeholder="Ваш email" className="bg-background" />
                        <Button>Підписатися</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Ми поважаємо вашу приватність і не надсилаємо спам.</p>
                </div>
            </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
