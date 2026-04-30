'use client';

import React, { Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  Users,
  FileText,
  MapPin,
  User,
  Eye,
  ArrowLeft,
  ArrowRight,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface ProfileResult {
  uid: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  shortBio?: string;
  bio?: string;
  country?: string;
  preferredLanguage?: string;
  hasActiveOffers?: boolean;
}

interface PostResult {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImageUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  categoryId: string;
  subcategoryId?: string;
  contentType: string;
  views?: number;
  publishedAt?: string;
  tags?: string[];
}

// ─── Profile Card ────────────────────────────────────────────────────────────

function SearchProfileCard({ profile }: { profile: ProfileResult }) {
  return (
    <Link href={`/profile/${profile.uid}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 border-border/40 hover:border-primary/20 bg-background/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Avatar className="mb-4 h-20 w-20 border-2 border-background shadow-md ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
            <AvatarImage src={profile.avatarUrl || ''} alt={profile.displayName || profile.name || 'avatar'} className="object-cover" />
            <AvatarFallback className="text-xl font-black bg-primary/5 text-primary/60">
              {(profile.displayName || profile.name)?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h3 className="text-base font-black text-foreground line-clamp-1 tracking-tight group-hover:text-primary transition-colors">
            {profile.displayName || profile.name}
          </h3>

          {profile.country && (
            <div className="flex items-center gap-1 mt-1.5 text-muted-foreground/60">
              <MapPin className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{profile.country}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground/70 line-clamp-2 min-h-[2.5rem] mt-3 mb-4 font-light leading-relaxed">
            {profile.shortBio || profile.bio || 'Користувач платформи LECTOR'}
          </p>

          {profile.hasActiveOffers && (
            <Badge className="mb-3 bg-green-500/10 text-green-600 border-green-500/20 text-[8px] font-black uppercase tracking-widest">
              Активні офери
            </Badge>
          )}

          <div className="w-full rounded-full border border-border/30 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex items-center justify-center gap-2">
            <User className="h-3 w-3" />
            Переглянути профіль
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Post Card ───────────────────────────────────────────────────────────────

function SearchPostCard({ post }: { post: PostResult }) {
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
    : '';

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 border-border/40 hover:border-primary/20 bg-background/80 backdrop-blur-sm">
        {/* Cover image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-12 w-12 text-muted-foreground/10" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-[8px] uppercase font-bold tracking-[0.2em] rounded-md px-2 py-0.5 text-white">
              {post.contentType === 'blog' ? 'LECTOR' : 'POST'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          <h3 className="text-lg font-black leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs text-muted-foreground/60 line-clamp-2 font-light leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 border border-primary/10">
                <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                <AvatarFallback className="bg-primary/5 text-[7px] font-bold">{post.authorName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-bold text-foreground/70 tracking-tight truncate max-w-[100px]">
                {post.authorName}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50 font-mono">
              {post.views !== undefined && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {post.views}
                </span>
              )}
              {dateStr && (
                <span className="italic">{dateStr}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Active Filters ──────────────────────────────────────────────────────────

function ActiveFilters({ params, onRemove }: { params: URLSearchParams; onRemove: (key: string) => void }) {
  const filterLabels: Record<string, string> = {
    category: 'Категорія',
    subcategory: 'Підкатегорія',
    language: 'Мова',
    country: 'Країна',
    type: 'Тип',
    author: 'Автор',
    sort: 'Сортування',
    hasOffers: 'З оферами',
  };

  const activeFilters = Array.from(params.entries())
    .filter(([key]) => !['scope', 'q'].includes(key) && filterLabels[key]);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map(([key, value]) => (
        <button
          key={key}
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-muted/30 text-[10px] font-bold uppercase tracking-wider text-foreground/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all group"
        >
          <span className="text-muted-foreground/40">{filterLabels[key]}:</span>
          <span>{value}</span>
          <X className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
}

// ─── Main Search Inner ──────────────────────────────────────────────────────

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const scope = searchParams.get('scope') || 'profiles';
  const query = searchParams.get('q') || '';

  const [profileResults, setProfileResults] = useState<ProfileResult[]>([]);
  const [postResults, setPostResults] = useState<PostResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  // Fetch results
  useEffect(() => {
    if (!query || query.length < 2) {
      setProfileResults([]);
      setPostResults([]);
      setTotalResults(0);
      return;
    }

    const controller = new AbortController();

    async function fetchResults() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/search?${searchParams.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();

        if (!json.success) {
          setError(json.message || 'Помилка пошуку');
          return;
        }

        if (json.scope === 'profiles') {
          setProfileResults(json.results || []);
          setPostResults([]);
        } else {
          setPostResults(json.results || []);
          setProfileResults([]);
        }
        setTotalResults(json.total || 0);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Не вдалося виконати пошук. Спробуйте ще раз.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
    return () => controller.abort();
  }, [searchParams]);

  // Remove filter
  const handleRemoveFilter = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(key);
    router.push(`/search?${newParams.toString()}`);
  }, [searchParams, router]);

  const isQueryTooShort = query.length > 0 && query.length < 2;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans tracking-tight">
      <Navigation />

      <main className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* ─── Header ─── */}
        <div className="max-w-4xl mx-auto space-y-8 mb-16">
          {/* Back to blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Назад до LECTOR
          </Link>

          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-primary/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/50">
                {scope === 'profiles' ? 'Пошук персонажів' : 'Пошук публікацій'}
              </span>
            </div>

            {query && (
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                <span className="text-foreground/30">«</span>
                {query}
                <span className="text-foreground/30">»</span>
              </h1>
            )}

            {!isLoading && !error && query.length >= 2 && (
              <p className="text-sm text-muted-foreground/60 font-light">
                {totalResults === 0
                  ? 'Нічого не знайдено'
                  : `${totalResults} результат${totalResults !== 1 ? 'ів' : ''}`}
              </p>
            )}
          </div>

          {/* Active filters */}
          <ActiveFilters params={searchParams} onRemove={handleRemoveFilter} />
        </div>

        {/* ─── States ─── */}

        {/* Too short query */}
        {isQueryTooShort && (
          <div className="max-w-md mx-auto text-center py-24 space-y-6">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
              <Search className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground/80">Введіть щонайменше 2 символи</h3>
              <p className="text-sm text-muted-foreground/50 font-light">
                Для точнішого пошуку введіть більше деталей у пошуковий запит.
              </p>
            </div>
          </div>
        )}

        {/* No query */}
        {!query && (
          <div className="max-w-md mx-auto text-center py-24 space-y-6">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
              <Search className="h-7 w-7 text-muted-foreground/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground/80">Почніть пошук</h3>
              <p className="text-sm text-muted-foreground/50 font-light">
                Перейдіть на сторінку блогу та натисніть кнопку пошуку, щоб задати критерії.
              </p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="rounded-full px-8 font-bold text-xs uppercase tracking-widest">
                Перейти до блогу
              </Button>
            </Link>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto text-center py-24 space-y-6">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle className="h-7 w-7 text-destructive/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground/80">Помилка пошуку</h3>
              <p className="text-sm text-muted-foreground/50 font-light">{error}</p>
            </div>
            <Button
              onClick={() => router.refresh()}
              variant="outline"
              className="rounded-full px-8 font-bold text-xs uppercase tracking-widest"
            >
              Спробувати ще
            </Button>
          </div>
        )}

        {/* ─── Results ─── */}
        {!isLoading && !error && query.length >= 2 && (
          <div className="max-w-5xl mx-auto">
            {/* Profile results */}
            {scope === 'profiles' && profileResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileResults.map(profile => (
                  <SearchProfileCard key={profile.uid} profile={profile} />
                ))}
              </div>
            )}

            {/* Post results */}
            {scope === 'posts' && postResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postResults.map(post => (
                  <SearchPostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {totalResults === 0 && (
              <div className="max-w-md mx-auto text-center py-24 space-y-6">
                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                  <Inbox className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground/80">Нічого не знайдено</h3>
                  <p className="text-sm text-muted-foreground/50 font-light">
                    Спробуйте змінити пошуковий запит або зняти фільтри.
                  </p>
                </div>
                <Link href="/blog">
                  <Button variant="outline" className="rounded-full px-8 font-bold text-xs uppercase tracking-widest">
                    Повернутися до блогу
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ─── Export with Suspense ────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto px-4 py-24 space-y-12">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
