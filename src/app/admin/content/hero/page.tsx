'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db, storage } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { HomeHeroMediaSettings } from '@/lib/types';

function HeroTabContent({ docId, title, description, showTextFields }: { docId: string, title: string, description: string, showTextFields: boolean }) {
    const [settings, setSettings] = useState<HomeHeroMediaSettings>({
        enabled: true,
        mediaType: 'video',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // File states handling
    const [desktopVideoFile, setDesktopVideoFile] = useState<File | null>(null);
    const [mobileVideoFile, setMobileVideoFile] = useState<File | null>(null);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Initial load
    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'siteSettings', docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as HomeHeroMediaSettings);
                } else {
                    // Start fresh if no doc exists yet for this tab
                    setSettings({ enabled: true, mediaType: 'video' });
                }
            } catch (error) {
                console.error(`Error loading hero settings for ${docId}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, [docId]);

    const uploadFile = async (file: File, pathPrefix: string) => {
        const fileExt = file.name.split('.').pop();
        const fullPath = `site/home-hero/${docId}_${pathPrefix}_${Date.now()}.${fileExt}`;
        const storageRef = ref(storage, fullPath);
        const snapshot = await uploadBytesResumable(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return { url, path: fullPath };
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let newSettings = { ...settings };

            if (desktopVideoFile) {
                const { url, path } = await uploadFile(desktopVideoFile, 'desktop_video');
                newSettings.desktopVideoUrl = url;
                newSettings.desktopVideoPath = path;
            }
            if (mobileVideoFile) {
                const { url, path } = await uploadFile(mobileVideoFile, 'mobile_video');
                newSettings.mobileVideoUrl = url;
                newSettings.mobileVideoPath = path;
            }
            if (posterFile) {
                const { url, path } = await uploadFile(posterFile, 'poster');
                newSettings.posterUrl = url;
                newSettings.posterPath = path;
            }
            if (imageFile) {
                const { url, path } = await uploadFile(imageFile, 'image');
                newSettings.imageUrl = url;
                newSettings.imagePath = path;
            }

            newSettings.updatedAt = serverTimestamp();

            await setDoc(doc(db, 'siteSettings', docId), newSettings);
            setSettings(newSettings);
            
            // logically clear file inputs 
            setDesktopVideoFile(null);
            setMobileVideoFile(null);
            setPosterFile(null);
            setImageFile(null);

            alert('Settings saved successfully!');
        } catch (error) {
            console.error(`Failed to save hero settings for ${docId}`, error);
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-muted-foreground">Loading {title}...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Switch 
                        id={`enabled-${docId}`} 
                        checked={settings.enabled} 
                        onCheckedChange={(c) => setSettings({...settings, enabled: c})} 
                    />
                    <Label htmlFor={`enabled-${docId}`}>Enable Hero Module</Label>
                </div>

                <div className="space-y-3 pt-4 border-t">
                    <Label>Media Type</Label>
                    <RadioGroup 
                        value={settings.mediaType} 
                        onValueChange={(v) => setSettings({...settings, mediaType: v as 'video' | 'image'})}
                        className="flex items-center space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="video" id={`r1-${docId}`} />
                            <Label htmlFor={`r1-${docId}`}>Video</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="image" id={`r2-${docId}`} />
                            <Label htmlFor={`r2-${docId}`}>Image</Label>
                        </div>
                    </RadioGroup>
                </div>

                {settings.mediaType === 'video' && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Video Assets</h3>
                        <div className="space-y-2">
                            <Label>Desktop Video (MP4)</Label>
                            {settings.desktopVideoUrl && !desktopVideoFile && (
                                <p className="text-sm text-green-600 mb-2">Currently uploaded.</p>
                            )}
                            <Input type="file" accept="video/mp4" onChange={(e) => setDesktopVideoFile(e.target.files?.[0] || null)} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Mobile Video (MP4) - Optional</Label>
                            {settings.mobileVideoUrl && !mobileVideoFile && (
                                <p className="text-sm text-green-600 mb-2">Currently uploaded.</p>
                            )}
                            <Input type="file" accept="video/mp4" onChange={(e) => setMobileVideoFile(e.target.files?.[0] || null)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Poster Image - Optional</Label>
                            {settings.posterUrl && !posterFile && (
                                <img src={settings.posterUrl} alt="Poster preview" className="w-32 h-32 object-cover rounded-md mb-2" />
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                )}

                {settings.mediaType === 'image' && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Image Asset</h3>
                        <div className="space-y-2">
                            <Label>Static Image (Fallback/Alternative)</Label>
                            {settings.imageUrl && !imageFile && (
                                <img src={settings.imageUrl} alt="Hero preview" className="w-32 h-32 object-cover rounded-md mb-2" />
                            )}
                            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                )}

                {showTextFields && (
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Text Content</h3>
                        <div className="space-y-2">
                            <Label>Headline</Label>
                            <Input 
                                value={settings.headline || ''} 
                                onChange={(e) => setSettings({...settings, headline: e.target.value})} 
                                placeholder="Large hero title text" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subheadline</Label>
                            <Input 
                                value={settings.subheadline || ''} 
                                onChange={(e) => setSettings({...settings, subheadline: e.target.value})} 
                                placeholder="Secondary descriptive text below headline" 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Button Label</Label>
                                <Input 
                                    value={settings.buttonLabel || ''} 
                                    onChange={(e) => setSettings({...settings, buttonLabel: e.target.value})} 
                                    placeholder="e.g. Join the Community" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Button Link / URL</Label>
                                <Input 
                                    value={settings.buttonLink || ''} 
                                    onChange={(e) => setSettings({...settings, buttonLink: e.target.value})} 
                                    placeholder="e.g. /register or https://..." 
                                />
                            </div>
                        </div>
                    </div>
                )}

            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function HeroAdminPage() {
    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Hero Media Management</h1>
                <p className="text-muted-foreground">Manage the hero visual areas across the core platform pages.</p>
            </div>

            <Tabs defaultValue="home" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="home">Головна (Home)</TabsTrigger>
                    <TabsTrigger value="pro">Експерти (Pro)</TabsTrigger>
                    <TabsTrigger value="community">Користувачі (Community)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="home">
                    <HeroTabContent 
                        docId="homeHeroMedia" 
                        title="Homepage Hero" 
                        description="Manage the circular media on the main landing page."
                        showTextFields={false}
                    />
                </TabsContent>
                
                <TabsContent value="pro">
                     <HeroTabContent 
                        docId="proHeroMedia" 
                        title="Pro / Expert Hero" 
                        description="Manage the 21:9 hero with dynamic text blocks for the For Expert page."
                        showTextFields={true}
                    />
                </TabsContent>
                
                <TabsContent value="community">
                     <HeroTabContent 
                        docId="communityHeroMedia" 
                        title="Community / User Hero" 
                        description="Manage the 21:9 hero with dynamic text blocks for the For Community page."
                        showTextFields={true}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
