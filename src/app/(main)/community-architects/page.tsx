'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { PageCloseButton } from '@/components/page-close-button';
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
  CheckCircle2,
  ChevronRight,
  GanttChartSquare,
  Globe,
  Award,
  LayoutGrid,
  GitBranch,
  Newspaper,
  MessageCircle,
  Scale,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <Navigation subtitle="Governance" />
      <PageCloseButton fallbackHref="/" />

      <main className="flex-grow">
        {/* HERO */}
        <section className="py-20 md:py-32 px-4 border-b border-border/30 bg-slate-50/30">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 text-accent text-[11px] uppercase tracking-[0.2em] font-black mb-8">
              <Landmark className="h-3.5 w-3.5" />
              Platform Governance
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-foreground uppercase leading-none">
              Community Architects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Офіційно визнані представники підкатегорій, які формують локальні професійні спільноти та підтримують культуру якості на платформі.
            </p>
            <div className="pt-10">
              <Link
                href="/architects/apply"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white text-sm font-black uppercase tracking-widest hover:bg-accent/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Стати Community Architect
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 1. ХТО ТАКИЙ COMMUNITY ARCHITECT */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                    Хто такий Community Architect
                  </h2>
                  <div className="h-1.5 w-24 bg-accent rounded-full" />
                </div>
                <div className="space-y-6">
                  <p className="text-xl text-foreground/80 leading-relaxed font-medium">
                    <span className="text-accent font-black">Community Architect</span> — це офіційно визнаний представник конкретної підкатегорії в межах своєї країни. Це не випадкова декоративна галочка і не формальна назва.
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Це роль для активного учасника, який допомагає формувати професійну спільноту навколо своєї ніші, підтримує культуру якості, представляє голос підкатегорії та бере участь у розвитку середовища.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-6">
                    {[
                      'Представляє конкретну підкатегорію у конкретній країні',
                      'Допомагає посилювати якість професійного середовища',
                      'Є орієнтиром для інших учасників спільноти',
                      'Має представницьку, статусну та організаційну роль'
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-base font-bold text-foreground/70">
                        <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="p-10 rounded-[48px] bg-accent/5 border border-accent/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Landmark className="h-40 w-40" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-accent mb-8">Важливе уточнення</h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed relative z-10 font-medium">
                    Архітектор не є повним адміністратором або фінансовим оператором. Він не має необмеженої влади — його роль спрямована на розвиток, представництво та підтримку стандартів якості.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ТРИ РОЛІ GOVERNANCE */}
        <section className="py-24 px-4 bg-slate-50/50 border-y border-border/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                Структура Governance
              </h2>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-black opacity-60">
                Три ключові ролі в управлінні екосистемою LECTOR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role 1: Community Architect */}
              <div className="p-10 rounded-[48px] bg-white border border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-20 h-20 rounded-[32px] bg-slate-100/80 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Landmark className="h-10 w-10 text-accent relative z-10" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Community Architect</h3>
                    <div className="inline-flex px-3 py-1 rounded-full bg-accent/10 text-[10px] font-black text-accent uppercase tracking-[0.2em]">
                      Архітектор підкатегорії
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Представляє конкретну підкатегорію у своїй країні. Допомагає формувати професійну спільноту та підтримує якість середовища.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    <MapPin className="h-3 w-3" />
                    Наприклад: Тарологія / Україна
                  </div>
                </div>
              </div>

              {/* Role 2: Country Curator */}
              <div className="p-10 rounded-[48px] bg-white border border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-20 h-20 rounded-[32px] bg-zinc-900 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-black transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Landmark className="h-10 w-10 text-white relative z-10" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Country Curator</h3>
                    <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      Координатор у країні
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Координує роботу архітекторів різних підкатегорій у межах однієї країни. Допомагає синхронізувати локальну спільноту.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    <Users className="h-3 w-3" />
                    Обирається з числа Architects
                  </div>
                </div>
              </div>

              {/* Role 3: Subcategory Curator */}
              <div className="p-10 rounded-[48px] bg-white border border-border/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-20 h-20 rounded-[32px] bg-white border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-50 transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-black/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Landmark className="h-10 w-10 text-zinc-900 relative z-10" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Subcategory Curator</h3>
                    <div className="inline-flex text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                      Вертикальний куратор
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Координує архітекторів в одній конкретній підкатегорії на рівні всієї платформи. Розвиває вертикаль ніші у всіх країнах.
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    <Sparkles className="h-3 w-3" />
                    Обирається з числа Architects
                  </div>
                </div>
              </div>
            </div>

            {/* Table Comparison */}
            <div className="mt-20 overflow-hidden rounded-[48px] border border-border/40 bg-white shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border/40">
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Роль</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Рівень впливу</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground">Кого представляє</th>
                    <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right">Як отримується</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {[
                    { role: 'Community Architect', level: 'країна + підкатегорія', represent: 'свою підкатегорію у своїй країні', get: 'заявка / розгляд' },
                    { role: 'Country Curator', level: 'країна', represent: 'архітекторів різних підкатегорій у країні', get: 'голосування / вибір' },
                    { role: 'Subcategory Curator', level: 'підкатегорія (глобально)', represent: 'архітекторів однієї підкатегорії всюди', get: 'голосування / вибір' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6 text-base font-black text-foreground">{row.role}</td>
                      <td className="px-10 py-6 text-sm text-muted-foreground font-bold uppercase tracking-tight">{row.level}</td>
                      <td className="px-10 py-6 text-base text-muted-foreground font-medium">{row.represent}</td>
                      <td className="px-10 py-6 text-sm text-accent font-black uppercase tracking-widest text-[11px] text-right">{row.get}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. ПРИВІЛЕЇ ТА ІНСТРУМЕНТИ */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-4 space-y-8 sticky top-32">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
                    Що відкриває статус Community Architect
                  </h2>
                  <div className="h-1.5 w-24 bg-accent rounded-full" />
                </div>
                <div className="p-8 rounded-[40px] bg-slate-50 border border-border/40 space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    Community Architect не отримує необмеженої влади над іншими користувачами. Його роль — це посилений голос, статусна присутність, доступ до закритих обговорень і інструменти підтримки якості своєї підкатегорії.
                  </p>
                  <p className="text-lg text-accent font-black italic">
                    &ldquo;Це не влада над спільнотою, а відповідальність перед нею.&rdquo;
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Award,
                      title: 'Публічний статус',
                      desc: 'Community Architect отримує видиме статусне відображення у профілі та може бути представлений у каталозі архітекторів своєї країни й підкатегорії.'
                    },
                    {
                      icon: Newspaper,
                      title: 'Статті на сайті',
                      desc: 'Архітектор може подавати авторські матеріали або статті на сайт LECTOR. Після розгляду вони можуть публікуватися з позначкою, що автор є Community Architect.'
                    },
                    {
                      icon: MessageCircle,
                      title: 'Architects Hub',
                      desc: 'Закритий простір для архітекторів: професійне спілкування, обмін досвідом, тематичні обговорення, новини платформи та координація спільноти.'
                    },
                    {
                      icon: Scale,
                      title: 'Право голосу',
                      desc: 'Community Architect отримує право брати участь у голосуваннях Architect Council: щодо розвитку напрямів, пропозицій, кураторських ролей та важливих рішень екосистеми.'
                    },
                    {
                      icon: Lightbulb,
                      title: 'Пропозиції розвитку',
                      desc: 'Архітектор може висувати пропозиції щодо розвитку підкатегорії, нових функцій, стандартів, тематичних орієнтирів і потреб своєї професійної спільноти.'
                    },
                    {
                      icon: ShieldAlert,
                      title: 'Сигнали якості',
                      desc: 'Архітектор може передавати пріоритетні сигнали щодо некоректного контенту або порушень стандартів. Такі сигнали потрапляють на розгляд швидше та можуть тимчасово впливати на видимість до перевірки.'
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-8 rounded-[40px] border border-border/40 bg-white hover:border-accent/20 hover:shadow-xl transition-all group flex flex-col h-full">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent/5 transition-all">
                        <item.icon className="h-7 w-7 text-foreground group-hover:text-accent transition-colors" />
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight text-foreground mb-4 group-hover:text-accent transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-base text-muted-foreground leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ЯК СТАТИ ARCHITECT */}
        <section className="py-24 px-4 bg-accent text-white rounded-t-[60px] md:rounded-t-[100px]">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              Як стати Community Architect
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto mb-16 text-white/80">
              <p className="text-xl md:text-3xl leading-relaxed font-medium">
                Користувач, який бачить себе представником своєї підкатегорії в країні, може подати заявку на розгляд.
              </p>
              <p className="text-lg md:text-xl leading-relaxed opacity-70 font-medium">
                Команда платформи розглядає заявки з погляду відповідності ролі, якості профілю, наміру, активності та потенційної користі для спільноти.
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                href="/architects/apply"
                className="w-full sm:w-auto px-12 py-6 rounded-full bg-white text-accent text-sm font-black uppercase tracking-widest hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                Подати заявку
              </Link>
            </div>
          </div>
        </section>

        {/* 5. КАТАЛОГ АРХІТЕКТОРІВ (Existing Directory) */}
        <section id="directory" className="py-32 px-4 bg-white relative z-10">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                Діючі Community Architects
              </h2>
              <p className="text-sm md:text-base text-muted-foreground uppercase tracking-widest font-black opacity-60">
                Представники підкатегорій по країнах
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
              <Select value={filterCountry} onValueChange={(v) => { setFilterCountry(v); }}>
                <SelectTrigger className="w-[200px] h-14 rounded-2xl border-muted/60 text-sm font-bold bg-slate-50/50">
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
                <SelectTrigger className="w-[200px] h-14 rounded-2xl border-muted/60 text-sm font-bold bg-slate-50/50">
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
                <SelectTrigger className="w-[220px] h-14 rounded-2xl border-muted/60 text-sm font-bold bg-slate-50/50">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-8 border border-border/40 rounded-[32px] space-y-6 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 bg-slate-50/50 rounded-[60px] border border-dashed border-border/60">
                <Landmark className="h-16 w-16 text-muted-foreground/20 mx-auto mb-8" />
                <p className="text-lg text-muted-foreground font-medium">
                  {assignments.length === 0
                    ? 'Наразі немає активних Community Architects.'
                    : 'Немає результатів за обраними фільтрами.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((architect) => (
                  <div
                    key={architect.id}
                    className="group p-8 border border-border/40 rounded-[40px] hover:border-accent/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 bg-white flex flex-col"
                  >
                    {/* Header: avatar + name */}
                    <div className="flex items-start gap-4 mb-8">
                      <Link href={`/profile/${architect.userId}`}>
                        <Avatar className="h-16 w-16 border-2 border-muted/20 shadow-sm cursor-pointer group-hover:border-accent/40 transition-all duration-500">
                          <AvatarImage src={architect.userAvatarUrl ?? undefined} alt={architect.userDisplayName} />
                          <AvatarFallback className="text-sm font-black bg-accent/5 text-accent">
                            {(architect.userDisplayName || '?').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="min-w-0 flex-1 pt-1">
                        <Link href={`/profile/${architect.userId}`} className="hover:text-accent transition-colors">
                          <h3 className="text-base font-black text-foreground truncate leading-tight group-hover:tracking-tight transition-all">
                            {architect.userDisplayName}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Award className="h-3.5 w-3.5 text-accent" />
                          <p className="text-[10px] uppercase tracking-widest text-accent font-black">
                            {architect.publicTitle || 'Community Architect'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-border/30">
                        <MapPin className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[11px] text-muted-foreground font-black uppercase tracking-tight">
                          {architect.countryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10">
                        <span className="text-[11px] text-accent font-black uppercase tracking-tight">
                          {architect.subcategoryName}
                        </span>
                      </div>
                    </div>

                    {/* Public statement */}
                    {architect.publicStatement && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-5 font-medium italic flex-grow">
                        &ldquo;{architect.publicStatement}&rdquo;
                      </p>
                    )}

                    {/* Term + CTA */}
                    <div className="flex items-center justify-between pt-8 border-t border-border/10 mt-auto">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <Calendar className="h-4 w-4" />
                        {safeFormatDate(architect.termStartAt)} — {safeFormatDate(architect.termEndAt)}
                      </div>
                      <Link
                        href={`/profile/${architect.userId}`}
                        className="flex items-center gap-2 text-xs font-black text-accent hover:text-accent/80 transition-all uppercase tracking-widest group/link"
                      >
                        Профіль
                        <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. WHAT THIS ROLE IS NOT */}
        <section className="py-24 px-4 bg-slate-50/50">
          <div className="container mx-auto max-w-5xl">
            <div className="p-12 border border-border/40 rounded-[60px] bg-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <AlertTriangle className="h-48 w-48" />
              </div>
              <div className="flex items-center gap-4 mb-12 relative z-10">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground/60" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                  What this role is not
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 relative z-10">
                {[
                  'Не повний адміністратор',
                  'Не фінансовий оператор',
                  'Не необмежений модератор',
                  'Не привілей без строку',
                  'Не інструмент тиску',
                  'Не засіб агресивного самопросування',
                  'Не гарантія кураторства',
                  'Не вище за правила платформи',
                  'Не закрита привілейована каста'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-base md:text-lg text-muted-foreground font-bold group">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/20 shrink-0 group-hover:bg-accent transition-colors" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-12 border-t border-border/10 text-center">
                <p className="text-lg md:text-2xl text-muted-foreground font-black italic opacity-80 leading-relaxed">
                  &ldquo;Роль архітектора — це не влада над спільнотою, а відповідальність перед нею.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ARCHITECT COUNCIL */}
        <section className="py-32 px-4 bg-black text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.1)_0,transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.05)_0,transparent_50%)] pointer-events-none" />

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
              <div className="flex-1 space-y-12">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-white/80 text-[11px] uppercase tracking-[0.3em] font-black">
                    <Landmark className="h-5 w-5" />
                    Strategic Governance
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                    Architect Council
                  </h2>
                </div>

                <div className="space-y-8 max-w-2xl">
                  <p className="text-white/80 text-xl md:text-3xl leading-relaxed font-medium">
                    <span className="text-white font-black">Architect Council</span> — це простір для стратегічної участі Community Architects у розвитку платформи.
                  </p>
                  <p className="text-white/60 text-lg md:text-xl leading-relaxed font-medium">
                    Це не просто закритий клуб, а потенційний інструмент спільного прийняття рішень, де ваші ідеї та зворотний зв’язок стають частиною дорожньої карти LECTOR.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                  {[
                    'Голосування за кураторів',
                    'Обговорення функціоналу',
                    'Тематичні рекомендації',
                    'Формування стандартів ніш',
                    'Участь у дорожній карті',
                    'Підтримка якості екосистеми'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm md:text-base font-black uppercase tracking-[0.25em] text-white/40 group">
                      <div className="w-2 h-2 rounded-full bg-accent shrink-0 group-hover:scale-150 transition-transform" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="shrink-0 w-full lg:w-auto">
                <div className="relative group">
                  <div className="absolute -inset-8 bg-accent/30 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <Link
                    href="/architect-council"
                    className="relative flex flex-col items-center justify-center p-16 md:p-24 rounded-[64px] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-1000 text-center min-w-[320px] md:min-w-[450px] backdrop-blur-xl"
                  >
                    <div className="w-24 h-24 rounded-[32px] border border-white/20 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-1000">
                      <Crown className="h-12 w-12 text-white" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-[0.4em] mb-4">Enter the Council</span>
                    <span className="text-xs text-white/40 font-black uppercase tracking-[0.3em]">Private Governance Workspace</span>
                    <div className="mt-12 flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-white group-hover:bg-white group-hover:text-black transition-all duration-700">
                      Увійти
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BRIDGE */}
        <section className="py-32 px-4 bg-white">
          <div className="container mx-auto max-w-5xl text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground leading-none">
                Бачите себе архітектором своєї підкатегорії?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-bold leading-relaxed max-w-3xl mx-auto">
                Якщо ви відчуваєте, що можете представляти свою нішу в межах країни, підтримувати якість середовища і брати участь у розвитку спільноти, ви можете подати заявку на розгляд.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/architects/apply"
                className="inline-flex items-center gap-4 px-14 py-7 rounded-full bg-accent text-white text-base font-black uppercase tracking-widest hover:bg-accent/90 transition-all hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:-translate-y-2"
              >
                Подати заявку на розгляд
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
