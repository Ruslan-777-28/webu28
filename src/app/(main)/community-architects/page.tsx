'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  BookOpen,
  Users,
  AlertTriangle,
  Landmark,
  Sparkles,
  Crown,
} from 'lucide-react';

type PublicArchitect = {
  id: string;
  userId: string;
  countryCode: string;
  countryName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  publicTitle: string;
  publicStatement: string;
  termStartAt: string;
  termEndAt: string;
  renewalCount: number;
  profileThemeEnabled: boolean;
  profileThemeMode: string;
  profileThemeUrl: string | null;
  userDisplayName: string;
  userAvatarUrl: string | null;
};

const safeFormatDate = (timestamp: any): string => {
  if (!timestamp) return '—';
  try {
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleDateString('uk-UA', { month: 'short', year: 'numeric' });
    }
  } catch { /* fallback */ }
  return '—';
};

export default function CommunityArchitectsPage() {
  const [assignments, setAssignments] = useState<PublicArchitect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch('/api/community-architects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAssignments(json.data);
        }
      } catch (error) {
        console.error('Error fetching community architects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Derive filter options from loaded data
  const countries = useMemo(() => [...new Set(assignments.map(a => a.countryName))].sort(), [assignments]);
  const categories = useMemo(() => [...new Set(assignments.map(a => a.categoryName))].sort(), [assignments]);
  const subcategories = useMemo(() => {
    let filtered = assignments;
    if (filterCategory !== 'all') filtered = filtered.filter(a => a.categoryName === filterCategory);
    return [...new Set(filtered.map(a => a.subcategoryName))].sort();
  }, [assignments, filterCategory]);

  // Apply filters
  const filtered = useMemo(() => {
    return assignments.filter(a => {
      if (filterCountry !== 'all' && a.countryName !== filterCountry) return false;
      if (filterCategory !== 'all' && a.categoryName !== filterCategory) return false;
      if (filterSubcategory !== 'all' && a.subcategoryName !== filterSubcategory) return false;
      return true;
    });
  }, [assignments, filterCountry, filterCategory, filterSubcategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation subtitle="Community Architects" />

      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 md:py-28 px-4 border-b border-border/30">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-6">
              <Landmark className="h-3 w-3" />
              Governance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Community Architects
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Офіційно визнані представники підкатегорій, які допомагають формувати локальні професійні спільноти,
              підтримують якість середовища та представляють голос своєї ніші на платформі.
            </p>
          </div>
        </section>

        {/* Filters + Directory */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-12">
              <Select value={filterCountry} onValueChange={(v) => { setFilterCountry(v); }}>
                <SelectTrigger className="w-[180px] rounded-xl border-muted/60 text-sm">
                  <SelectValue placeholder="Країна" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі країни</SelectItem>
                  {countries.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={(v) => { setFilterCategory(v); setFilterSubcategory('all'); }}>
                <SelectTrigger className="w-[180px] rounded-xl border-muted/60 text-sm">
                  <SelectValue placeholder="Категорія" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі категорії</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSubcategory} onValueChange={setFilterSubcategory}>
                <SelectTrigger className="w-[200px] rounded-xl border-muted/60 text-sm">
                  <SelectValue placeholder="Підкатегорія" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі підкатегорії</SelectItem>
                  {subcategories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Directory Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 border border-border/40 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Landmark className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {assignments.length === 0
                    ? 'Наразі немає активних Community Architects.'
                    : 'Немає результатів за обраними фільтрами.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((architect) => (
                  <div
                    key={architect.id}
                    className="group p-6 border border-border/40 rounded-2xl hover:border-accent/30 hover:shadow-md transition-all bg-white"
                  >
                    {/* Header: avatar + name */}
                    <div className="flex items-start gap-3 mb-4">
                      <Link href={`/profile/${architect.userId}`}>
                        <Avatar className="h-12 w-12 border-2 border-muted/30 shadow-sm cursor-pointer hover:border-accent/40 transition-colors">
                          <AvatarImage src={architect.userAvatarUrl ?? undefined} alt={architect.userDisplayName} />
                          <AvatarFallback className="text-xs font-bold bg-muted/30">
                            {(architect.userDisplayName || '?').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/profile/${architect.userId}`} className="hover:text-accent transition-colors">
                          <h3 className="text-sm font-bold text-foreground truncate leading-tight">
                            {architect.userDisplayName}
                          </h3>
                        </Link>
                        <p className="text-[10px] uppercase tracking-widest text-accent font-bold mt-0.5">
                          {architect.publicTitle || 'Community Architect'}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <MapPin className="h-3 w-3" />
                        {architect.countryName}
                      </span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {architect.subcategoryName}
                      </span>
                    </div>

                    {/* Public statement */}
                    {architect.publicStatement && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {architect.publicStatement}
                      </p>
                    )}

                    {/* Term + CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/20">
                      <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                        <Calendar className="h-3 w-3" />
                        {safeFormatDate(architect.termStartAt)} — {safeFormatDate(architect.termEndAt)}
                      </span>
                      <Link
                        href={`/profile/${architect.userId}`}
                        className="flex items-center gap-1 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider"
                      >
                        Профіль
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Principles Block */}
        <section className="py-20 px-4 bg-slate-50/50 border-t border-border/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
                <Shield className="h-3 w-3" />
                Principles
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Role, Principles & Public Commitments
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Представляє підкатегорію',
                  text: 'Виступає визнаним голосом своєї ніші у межах своєї країни, допомагаючи формувати професійну спільноту.',
                },
                {
                  icon: Shield,
                  title: 'Культура довіри і якості',
                  text: 'Підтримує стандарти поведінки, якість контенту і взаємоповагу в середовищі.',
                },
                {
                  icon: Sparkles,
                  title: 'Підсвічує сильні голоси',
                  text: 'Допомагає виявляти та підтримувати якісний контент і активних учасників спільноти.',
                },
                {
                  icon: BookOpen,
                  title: 'Тематичні орієнтири',
                  text: 'Допомагає формувати тематичні рекомендації та орієнтири для розвитку ніші.',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white border border-border/40 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2 text-foreground/80">{item.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* What this role is NOT */}
            <div className="mt-12 p-8 border border-border/60 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="h-4 w-4 text-muted-foreground/50" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
                  What this role is not
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  'Не повний адміністратор',
                  'Не фінансовий оператор',
                  'Не необмежений модератор',
                  'Не привілей без строку',
                  'Не інструмент токсичного тиску',
                  'Не засіб агресивного самопросування',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Architect Council Prestige Block */}
        <section className="py-24 px-4 bg-black text-white overflow-hidden relative">
          {/* Subtle background pattern/glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0,transparent_70%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] uppercase tracking-[0.2em] font-medium mb-6">
                  <Landmark className="h-3 w-3" />
                  Privileged Access
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Architect Council
                </h2>
                <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                  Закрите коло стратегічного впливу для найбільш активних та відданих Community Architects. 
                  Council — це не просто простір, це символ найвищої довіри, де ваші ідеї та зворотний зв’язок 
                  стають частиною дорожньої карти розвитку платформи.
                </p>
                <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                  {[
                    "Сила впливу",
                    "Стратегічне бачення",
                    "Відповідальність",
                    "Майбутнє платформи"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="shrink-0 w-full md:w-auto">
                <Link 
                  href="/architect-council"
                  className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-center min-w-[280px]"
                >
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Enter the Square</span>
                  <span className="text-[10px] text-white/40">Private Governance Workspace</span>
                  <ArrowRight className="h-4 w-4 mt-4 text-white/20 group-hover:text-white transition-colors group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
