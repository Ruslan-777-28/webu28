'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Users, FileText, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BlogCategory } from '@/lib/types';

interface BlogSearchSheetProps {
  categories: BlogCategory[];
}

export function BlogSearchSheet({ categories }: BlogSearchSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'posts'>('profiles');
  const router = useRouter();

  // ─── Profile form state ───
  const [profileQuery, setProfileQuery] = useState('');
  const [profileCategory, setProfileCategory] = useState('');
  const [profileSubcategory, setProfileSubcategory] = useState('');
  const [profileCountry, setProfileCountry] = useState('');
  const [profileLanguage, setProfileLanguage] = useState('');
  const [profileHasOffers, setProfileHasOffers] = useState(false);

  // ─── Post form state ───
  const [postQuery, setPostQuery] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postSubcategory, setPostSubcategory] = useState('');
  const [postType, setPostType] = useState('all');
  const [postAuthor, setPostAuthor] = useState('');
  const [postSort, setPostSort] = useState('relevance');

  // ─── Subcategories derived from selected category ───
  const getSubcategories = useCallback((categoryId: string) => {
    if (!categoryId) return [];
    const cat = categories.find(c => c.id === categoryId);
    return cat?.subcategories?.filter(s => s.isActive !== false) || [];
  }, [categories]);

  const profileSubcategories = getSubcategories(profileCategory);
  const postSubcategories = getSubcategories(postCategory);

  // ─── Submit handlers ───
  const handleProfileSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (profileQuery.trim().length < 2) return;

    const params = new URLSearchParams();
    params.set('scope', 'profiles');
    params.set('q', profileQuery.trim());
    if (profileCategory) params.set('category', profileCategory);
    if (profileSubcategory) params.set('subcategory', profileSubcategory);
    if (profileCountry) params.set('country', profileCountry);
    if (profileLanguage) params.set('language', profileLanguage);
    if (profileHasOffers) params.set('hasOffers', 'true');

    setIsOpen(false);
    router.push(`/search?${params.toString()}`);
  }, [profileQuery, profileCategory, profileSubcategory, profileCountry, profileLanguage, profileHasOffers, router]);

  const handlePostSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (postQuery.trim().length < 2) return;

    const params = new URLSearchParams();
    params.set('scope', 'posts');
    params.set('q', postQuery.trim());
    if (postCategory) params.set('category', postCategory);
    if (postSubcategory) params.set('subcategory', postSubcategory);
    if (postType !== 'all') params.set('type', postType);
    if (postAuthor.trim()) params.set('author', postAuthor.trim());
    if (postSort !== 'relevance') params.set('sort', postSort);

    setIsOpen(false);
    router.push(`/search?${params.toString()}`);
  }, [postQuery, postCategory, postSubcategory, postType, postAuthor, postSort, router]);

  // Shared select styling
  const selectClass = "w-full h-10 px-3 rounded-lg border border-border/40 bg-background text-sm font-medium text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all appearance-none cursor-pointer";
  const labelClass = "text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mb-1.5 block";
  const inputClass = "w-full h-12 px-4 rounded-xl border border-border/40 bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <>
      {/* ─── Floating Action Button ─── */}
      <button
        id="blog-search-fab"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-50 bottom-6 right-6",
          "h-14 w-14 rounded-full",
          "bg-foreground text-background",
          "shadow-[0_8px_32px_rgba(0,0,0,0.25)]",
          "flex items-center justify-center",
          "hover:scale-110 active:scale-95",
          "transition-all duration-300 ease-out",
          "group"
        )}
        aria-label="Пошук у LECTOR"
      >
        <Search className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* ─── Bottom Sheet ─── */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[85vh] overflow-y-auto p-0 border-t-0 shadow-[0_-16px_64px_rgba(0,0,0,0.15)]"
        >
          {/* ─── Header ─── */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/20 sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-black tracking-tight">
                Знайти в LECTOR
              </SheetTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </SheetHeader>

          {/* ─── Tabs ─── */}
          <div className="px-6 pt-4 pb-8">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'profiles' | 'posts')}
            >
              <TabsList className="w-full bg-muted/50 p-1 rounded-xl h-12">
                <TabsTrigger
                  value="profiles"
                  className="flex-1 rounded-lg font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:shadow-md h-10"
                >
                  <Users className="h-3.5 w-3.5" />
                  LECTORS
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="flex-1 rounded-lg font-bold text-xs uppercase tracking-widest gap-2 data-[state=active]:shadow-md h-10"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Пости
                </TabsTrigger>
              </TabsList>

              {/* ─── Tab: Profiles ─── */}
              <TabsContent value="profiles" className="mt-5">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Main query */}
                  <div>
                    <label className={labelClass}>Кого шукаємо?</label>
                    <input
                      type="text"
                      value={profileQuery}
                      onChange={(e) => setProfileQuery(e.target.value)}
                      placeholder="Ім'я, нік, спеціалізація або ключове слово"
                      className={inputClass}
                      autoFocus
                    />
                    {profileQuery.length > 0 && profileQuery.length < 2 && (
                      <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">
                        Мінімум 2 символи для пошуку
                      </p>
                    )}
                  </div>

                  {/* Filters row */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground/40">
                      <SlidersHorizontal className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Фільтри</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Category */}
                      <div>
                        <label className={labelClass}>Категорія</label>
                        <select
                          value={profileCategory}
                          onChange={(e) => {
                            setProfileCategory(e.target.value);
                            setProfileSubcategory('');
                          }}
                          className={selectClass}
                        >
                          <option value="">Усі</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory */}
                      <div>
                        <label className={labelClass}>Підкатегорія</label>
                        <select
                          value={profileSubcategory}
                          onChange={(e) => setProfileSubcategory(e.target.value)}
                          className={selectClass}
                          disabled={!profileCategory}
                        >
                          <option value="">Усі</option>
                          {profileSubcategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Country */}
                      <div>
                        <label className={labelClass}>Країна</label>
                        <input
                          type="text"
                          value={profileCountry}
                          onChange={(e) => setProfileCountry(e.target.value)}
                          placeholder="Наприклад: Україна"
                          className={selectClass}
                        />
                      </div>

                      {/* Language */}
                      <div>
                        <label className={labelClass}>Мова</label>
                        <select
                          value={profileLanguage}
                          onChange={(e) => setProfileLanguage(e.target.value)}
                          className={selectClass}
                        >
                          <option value="">Усі</option>
                          <option value="uk">Українська</option>
                          <option value="en">English</option>
                          <option value="ru">Русский</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick filter */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setProfileHasOffers(false)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                          !profileHasOffers
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground/60 border-border/40 hover:border-foreground/30"
                        )}
                      >
                        Усі
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileHasOffers(true)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                          profileHasOffers
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-foreground/60 border-border/40 hover:border-foreground/30"
                        )}
                      >
                        З активними оферами
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={profileQuery.trim().length < 2}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg mt-2"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Шукати персонажів
                  </Button>
                </form>
              </TabsContent>

              {/* ─── Tab: Posts ─── */}
              <TabsContent value="posts" className="mt-5">
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  {/* Main query */}
                  <div>
                    <label className={labelClass}>Що шукаємо?</label>
                    <input
                      type="text"
                      value={postQuery}
                      onChange={(e) => setPostQuery(e.target.value)}
                      placeholder="Тема, слово, тег або назва публікації"
                      className={inputClass}
                      autoFocus
                    />
                    {postQuery.length > 0 && postQuery.length < 2 && (
                      <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium">
                        Мінімум 2 символи для пошуку
                      </p>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground/40">
                      <SlidersHorizontal className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">Фільтри</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Category */}
                      <div>
                        <label className={labelClass}>Категорія</label>
                        <select
                          value={postCategory}
                          onChange={(e) => {
                            setPostCategory(e.target.value);
                            setPostSubcategory('');
                          }}
                          className={selectClass}
                        >
                          <option value="">Усі</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory */}
                      <div>
                        <label className={labelClass}>Підкатегорія</label>
                        <select
                          value={postSubcategory}
                          onChange={(e) => setPostSubcategory(e.target.value)}
                          className={selectClass}
                          disabled={!postCategory}
                        >
                          <option value="">Усі</option>
                          {postSubcategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Content type */}
                      <div>
                        <label className={labelClass}>Тип контенту</label>
                        <select
                          value={postType}
                          onChange={(e) => setPostType(e.target.value)}
                          className={selectClass}
                        >
                          <option value="all">Усі</option>
                          <option value="blog">Статті LECTOR</option>
                          <option value="post">Пости авторів</option>
                        </select>
                      </div>

                      {/* Sort */}
                      <div>
                        <label className={labelClass}>Сортування</label>
                        <select
                          value={postSort}
                          onChange={(e) => setPostSort(e.target.value)}
                          className={selectClass}
                        >
                          <option value="relevance">Релевантність</option>
                          <option value="newest">Новіші</option>
                          <option value="popular">Популярніші</option>
                        </select>
                      </div>
                    </div>

                    {/* Author */}
                    <div>
                      <label className={labelClass}>Автор (опціонально)</label>
                      <input
                        type="text"
                        value={postAuthor}
                        onChange={(e) => setPostAuthor(e.target.value)}
                        placeholder="Ім'я автора"
                        className={selectClass}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={postQuery.trim().length < 2}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg mt-2"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Шукати публікації
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
