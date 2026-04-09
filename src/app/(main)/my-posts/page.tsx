'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useUser } from '@/hooks/use-auth';
import type { Post, EditorialStatus } from '@/lib/types';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Edit, Send, FileText, Search, FilePen, CheckCircle2, XCircle, Info, MessageSquare, PlusCircle } from 'lucide-react';
import { EditPostModal } from './_components/edit-post-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreatePostModal } from '@/components/create-post-modal';

const editorialStatusInfo: Record<EditorialStatus, { label: string; icon: React.ElementType, description: string }> = {
    draft: { label: 'Не подано на сайт', icon: FileText, description: 'Ця чернетка видима тільки вам.' },
    submitted: { label: 'Подано на розгляд', icon: Send, description: 'Матеріал очікує на перевірку модератором.' },
    under_review: { label: 'На перевірці', icon: Search, description: 'Модератор переглядає ваш матеріал.' },
    changes_requested: { label: 'Потрібні правки', icon: FilePen, description: 'Модератор залишив коментарі. Внесіть правки та надішліть матеріал повторно.' },
    published: { label: 'Опубліковано на сайті', icon: CheckCircle2, description: 'Вітаємо! Ваш матеріал опубліковано.' },
    rejected: { label: 'Відхилено', icon: XCircle, description: 'На жаль, цей матеріал було відхилено.' },
};

export default function MyPostsPage() {
    const { user, loading: userLoading } = useUser();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<(Post & { id: string }) | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            if (!userLoading) {
                setIsLoading(false);
            }
            return;
        }

        const q = query(
            collection(db, 'posts'),
            where('authorId', '==', user.uid),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post & { id: string }));
            setPosts(userPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching posts: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, userLoading]);

    const handleResubmit = async (postId: string) => {
        const postRef = doc(db, 'posts', postId);
        try {
            await updateDoc(postRef, {
                editorialStatus: 'submitted',
                revisionRequested: false,
                revisionSubmittedAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            toast({ title: "Матеріал надіслано повторно!", description: "Ваші зміни відправлено на розгляд." });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Помилка", description: "Не вдалося надіслати матеріал. " + error.message });
        }
    };
    
    if (userLoading || isLoading) {
        return (
             <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Skeleton className="h-8 w-64 mb-8" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!user) {
         return (
             <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto px-4 py-8 text-center">
                    <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Доступ обмежено</h1>
                    <p className="text-muted-foreground mb-4">Будь ласка, увійдіть, щоб переглянути свої публікації.</p>
                     <Dialog>
                        <DialogTrigger asChild><Button>Увійти</Button></DialogTrigger>
                    </Dialog>
                </main>
                <Footer />
            </div>
        );
    }


    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Мої публікації</h1>
                     <Dialog open={isCreateModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2"/>
                                Створити публікацію
                            </Button>
                        </DialogTrigger>
                        <CreatePostModal setOpen={setCreateModalOpen} />
                    </Dialog>
                </div>

                {posts.length === 0 ? (
                     <Card className="text-center py-16">
                        <CardContent>
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">У вас ще немає публікацій</h2>
                            <p className="text-muted-foreground mb-4">Створіть свій перший матеріал, щоб поділитися знаннями.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map(post => {
                             const status = post.editorialStatus || 'draft';
                             const statusInfo = editorialStatusInfo[status];

                             return (
                                <Card key={post.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                                        <CardDescription>
                                            <Badge variant="outline" className="font-normal">
                                                <statusInfo.icon className="h-3 w-3 mr-1.5" />
                                                {statusInfo.label}
                                            </Badge>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt || post.content}</p>

                                        {status === 'changes_requested' && post.revisionMessage && (
                                            <Alert variant="destructive" className="mt-4 text-sm">
                                                <AlertTitle className="font-bold flex items-center gap-2"><Info /> Зауваження модератора:</AlertTitle>
                                                <AlertDescription className="italic">"{post.revisionMessage}"</AlertDescription>
                                            </Alert>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex gap-2 justify-end">
                                        {status === 'changes_requested' && (
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="secondary">
                                                        <Send className="mr-2 h-4 w-4"/>
                                                        Надіслати повторно
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Надіслати повторно на розгляд?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Переконайтеся, що ви внесли всі необхідні зміни перед повторною відправкою.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleResubmit(post.id)}>Надіслати</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                                            <Edit className="mr-2 h-4 w-4"/>
                                            Редагувати
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </main>
            <Footer />
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    isOpen={!!editingPost}
                    setOpen={(isOpen) => {
                        if (!isOpen) setEditingPost(null);
                    }}
                />
            )}
        </div>
    );
}
