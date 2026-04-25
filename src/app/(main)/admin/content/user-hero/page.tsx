'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserPageHeroAdmin() {
    const { toast } = useToast();
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'sitePages', 'forCommunity');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setHeroTitle(data.heroTitle || '');
                    setHeroSubtitle(data.heroSubtitle || '');
                }
            } catch (error) {
                console.error('Error loading community hero text:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'sitePages', 'forCommunity');
            await setDoc(docRef, {
                heroTitle,
                heroSubtitle,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            
            toast({ title: 'Hero text saved successfully!' });
        } catch (error) {
            console.error('Error saving community hero text:', error);
            toast({ variant: 'destructive', title: 'Failed to save hero text.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-muted-foreground">Loading hero settings...</div>;

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/content" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">User Page Hero Text</h1>
                    <p className="text-muted-foreground">Edit the main text for the For Community page hero section.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hero Text Content</CardTitle>
                    <CardDescription>
                        This text will be displayed in the hero section of the /user page.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input 
                            id="heroTitle"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            placeholder="e.g. Знайдіть ясність у змістовній розмові"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                        <textarea 
                            id="heroSubtitle"
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            placeholder="e.g. LECTOR — це безпечний простір..."
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving} className="w-full">
                        {isSaving ? "Saving..." : "Save Changes"}
                        <Save className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
