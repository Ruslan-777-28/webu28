'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const defaultStages = [
  { id: 'q1', quarter: 'Q1', title: '', description: '', icon: 'Layers' },
  { id: 'q2', quarter: 'Q2', title: '', description: '', icon: 'Wallet' },
  { id: 'q3', quarter: 'Q3', title: '', description: '', icon: 'Award' },
  { id: 'q4', quarter: 'Q4', title: '', description: '', icon: 'Globe' }
];

export default function RoadmapAdminPage() {
    const { toast } = useToast();
    const [heroTitle, setHeroTitle] = useState('Roadmap');
    const [heroSubtitle, setHeroSubtitle] = useState('Стратегічний шлях 2026');
    const [heroDescription, setHeroDescription] = useState('Наша подорож від створення фундаменту до побудови глобального інтелектуального простору. Шлях, де кожна деталь має значення.');
    
    const [finalNodeLabel, setFinalNodeLabel] = useState('2027');
    const [finalNodeSubtitle, setFinalNodeSubtitle] = useState('Наступний етап');
    const [finalNodeMobileText, setFinalNodeMobileText] = useState('Глобальна зрілість');
    
    const [stages, setStages] = useState(defaultStages);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'sitePages', 'roadmap');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.heroTitle) setHeroTitle(data.heroTitle);
                    if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
                    if (data.heroDescription) setHeroDescription(data.heroDescription);
                    if (data.finalNodeLabel) setFinalNodeLabel(data.finalNodeLabel);
                    if (data.finalNodeSubtitle) setFinalNodeSubtitle(data.finalNodeSubtitle);
                    if (data.finalNodeMobileText) setFinalNodeMobileText(data.finalNodeMobileText);
                    if (data.stages && data.stages.length > 0) setStages(data.stages);
                }
            } catch (error) {
                console.error('Error loading roadmap data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'sitePages', 'roadmap');
            await setDoc(docRef, {
                heroTitle,
                heroSubtitle,
                heroDescription,
                finalNodeLabel,
                finalNodeSubtitle,
                finalNodeMobileText,
                stages,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            
            toast({ title: 'Roadmap saved successfully!' });
        } catch (error) {
            console.error('Error saving roadmap data:', error);
            toast({ variant: 'destructive', title: 'Failed to save roadmap.' });
        } finally {
            setIsSaving(false);
        }
    };

    const updateStage = (index: number, field: string, value: string) => {
        const newStages = [...stages];
        newStages[index] = { ...newStages[index], [field]: value };
        setStages(newStages);
    };

    if (isLoading) return <div className="p-8 text-muted-foreground">Loading roadmap settings...</div>;

    return (
        <div className="space-y-8 max-w-4xl pb-24 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/content" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Roadmap Content</h1>
                        <p className="text-muted-foreground">Edit the content of the /roadmap page.</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                    <Save className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* HERO SECTION SETTINGS */}
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Main title and description at the top of the page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Eyebrow (Subtitle)</Label>
                        <Input 
                            id="heroSubtitle"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            placeholder="e.g. Стратегічний шлях 2026"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Main Title</Label>
                        <Input 
                            id="heroTitle"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            placeholder="e.g. Roadmap"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroDescription">Description</Label>
                        <textarea 
                            id="heroDescription"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={heroDescription}
                            onChange={(e) => setHeroDescription(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* FINAL NODE SETTINGS */}
            <Card>
                <CardHeader>
                    <CardTitle>Final Node (End of Timeline)</CardTitle>
                    <CardDescription>The final point on the timeline (e.g. 2027).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-3 md:gap-4 md:space-y-0">
                    <div className="space-y-2">
                        <Label htmlFor="finalNodeLabel">Year / Label</Label>
                        <Input 
                            id="finalNodeLabel"
                            value={finalNodeLabel}
                            onChange={(e) => setFinalNodeLabel(e.target.value)}
                            placeholder="e.g. 2027"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="finalNodeSubtitle">Subtitle (Desktop)</Label>
                        <Input 
                            id="finalNodeSubtitle"
                            value={finalNodeSubtitle}
                            onChange={(e) => setFinalNodeSubtitle(e.target.value)}
                            placeholder="e.g. Наступний етап"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="finalNodeMobileText">Subtitle (Mobile)</Label>
                        <Input 
                            id="finalNodeMobileText"
                            value={finalNodeMobileText}
                            onChange={(e) => setFinalNodeMobileText(e.target.value)}
                            placeholder="e.g. Глобальна зрілість"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* QUARTERS SETTINGS */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold pt-4">Timeline Columns</h2>
                {stages.map((stage, index) => (
                    <Card key={index} className="border-accent/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Column {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Quarter Label</Label>
                                    <Input 
                                        value={stage.quarter}
                                        onChange={(e) => updateStage(index, 'quarter', e.target.value)}
                                        placeholder="e.g. Q1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input 
                                        value={stage.title}
                                        onChange={(e) => updateStage(index, 'title', e.target.value)}
                                        placeholder="e.g. Фундамент"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon Key</Label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={stage.icon}
                                        onChange={(e) => updateStage(index, 'icon', e.target.value)}
                                    >
                                        <option value="Layers">Layers (Foundation)</option>
                                        <option value="Wallet">Wallet (Monetization)</option>
                                        <option value="Award">Award (Status)</option>
                                        <option value="Globe">Globe (Scale)</option>
                                        <option value="MessageSquare">MessageSquare (Chat)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Deliverables / Body Text (One per line)</Label>
                                <textarea 
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={stage.description}
                                    onChange={(e) => updateStage(index, 'description', e.target.value)}
                                    placeholder="Point 1&#10;Point 2&#10;Point 3"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
