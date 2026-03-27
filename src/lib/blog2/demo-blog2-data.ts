import { Post, UserProfile } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

export interface DemoPost extends Post {
    isDemo: boolean;
}

// Stable, aesthetic fallbacks for different areas
export const BLOG_IMAGE_FALLBACK = {
    COVER: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000",
    THUMB: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400",
    AVATAR: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

export const DEMO_POSTS: DemoPost[] = [
    {
        id: 'demo-1',
        isDemo: true,
        contentType: 'blog',
        title: 'Коли мовчання говорить голосніше за слова: Мистецтво паузи',
        slug: 'art-of-silence',
        excerpt: 'Ми звикли заповнювати кожну секунду звуком. Але справжня мудрість народжується в тиші між думками.',
        coverImageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2000',
        authorId: 'demo-author-1',
        authorName: 'Марк Орелій',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        categoryId: 'wisdom',
        status: 'published',
        views: 1240,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
    },
    {
        id: 'demo-2',
        isDemo: true,
        contentType: 'blog',
        title: 'Фінансова свобода як внутрішній стан, а не цифра на рахунку',
        slug: 'financial-freedom-mindset',
        excerpt: 'Чому навіть мільйони не дарують спокою, якщо ваше ставлення до ресурсів базується на дефіциті.',
        coverImageUrl: 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?auto=format&fit=crop&q=80&w=2000',
        authorId: 'demo-author-2',
        authorName: 'Анна Разумова',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        categoryId: 'wealth',
        status: 'published',
        views: 890,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
    },
    {
        id: 'demo-3',
        isDemo: true,
        contentType: 'blog',
        title: 'Тіні минулого: Як завершити стосунки, які вже давно закінчилися',
        slug: 'ending-toxic-loops',
        excerpt: 'Інструкція з емоційної гігієни та розставання з ілюзіями, які тримають вас на місці.',
        coverImageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=2000',
        authorId: 'demo-author-1',
        authorName: 'Марк Орелій',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        categoryId: 'relationships',
        status: 'published',
        views: 2100,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: Timestamp.now(),
    }
];

export const EMOTIONAL_NAV_ITEMS = [
    {
        id: 'clarity',
        title: 'Потрібна ясність',
        description: 'Коли думки плутаються',
        color: 'bg-zinc-900',
        icon: 'Sparkles'
    },
    {
        id: 'anxiety',
        title: 'Коли тривожно',
        description: 'Пошук внутрішньої опори',
        color: 'bg-zinc-800',
        icon: 'Wind'
    },
    {
        id: 'decision',
        title: 'Складне рішення',
        description: 'Вибір власного шляху',
        color: 'bg-zinc-700',
        icon: 'Compass'
    },
    {
        id: 'love',
        title: 'Тема стосунків',
        description: 'Гармонія з собою та іншими',
        color: 'bg-zinc-900',
        icon: 'Heart'
    },
    {
        id: 'reboot',
        title: 'Перезавантаження',
        description: 'Коли сили на межі',
        color: 'bg-zinc-800',
        icon: 'RefreshCcw'
    },
    {
        id: 'finance',
        title: 'Фінансовий ступор',
        description: 'Енергія грошей та достатку',
        color: 'bg-zinc-700',
        icon: 'Coins'
    }
];
