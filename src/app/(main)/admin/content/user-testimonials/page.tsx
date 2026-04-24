'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { db, storage } from '@/lib/firebase/client';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UserTestimonialSlide, UserTestimonialsSettings } from '@/lib/types';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Edit2, Check, Megaphone, Upload, ImageIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function UserTestimonialsAdminPage() {
    const { toast } = useToast();
    const [settings, setSettings] = useState<UserTestimonialsSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'siteSettings', 'userTestimonials');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as UserTestimonialsSettings);
                } else {
                    setSettings({
                        updatedAt: null,
                        updatedBy: '',
                        slides: []
                    });
                }
            } catch (error) {
                console.error('Error loading testimonials:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, 'siteSettings', 'userTestimonials');
            await setDoc(docRef, {
                ...settings,
                updatedAt: serverTimestamp(),
            });
            toast({ title: 'Settings saved successfully!' });
        } catch (error) {
            console.error('Error saving testimonials:', error);
            toast({ variant: 'destructive', title: 'Failed to save settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (slideId: string, section: 'expert' | 'customer', file: File) => {
        setIsUploading(true);
        const timestamp = Date.now();
        const fileName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const storagePath = `site-content/user-testimonials/${slideId}/${section}-${timestamp}-${fileName}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            (error) => {
                console.error("Upload error:", error);
                toast({ variant: 'destructive', title: 'Image upload failed' });
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    updateSlideField(slideId, section, 'avatarUrl', url);
                    setIsUploading(false);
                    setUploadProgress(0);
                    toast({ title: 'Image uploaded successfully!' });
                });
            }
        );
    };

    const addSlide = () => {
        if (!settings) return;
        const newSlide: UserTestimonialSlide = {
            id: crypto.randomUUID(),
            isActive: true,
            order: settings.slides.length,
            expert: {
                avatarUrl: '',
                name: 'New Expert',
                roleLabel: 'РОЛЬ ЕКСПЕРТА',
                verifiedLabel: 'VERIFIED',
                countryCode: 'UA',
                countryName: 'Ukraine',
                languages: ['UA'],
                ratingLabel: 'ОЦІНКА ПРОФЕСІОНАЛУ',
                rating: 4.9,
                sessionsLabel: '100+ СЕСІЙ'
            },
            customer: {
                avatarUrl: '',
                name: 'New Customer',
                roleLabel: 'ЗАМОВНИК',
                countryCode: 'UA',
                languages: ['UA'],
                ratingLabel: 'ОЦІНКА ЗАМОВНИКУ',
                rating: 5.0,
                sessionsLabel: '10+ СЕСІЙ'
            },
            testimonial: {
                title: 'ВІДГУК',
                offerIdLabel: 'ОФЕР ID 0 000',
                communicationType: 'ВІДЕОЧАТ',
                categoryLabel: 'КАТЕГОРІЯ',
                firstText: 'Текст відгуку один...',
                firstRating: 4.8,
                secondText: 'Текст відгуку два...',
                secondRating: 4.8,
                communicationDateLabel: 'ДАТА КОМУНІКАЦІЇ: 01.01.2026'
            }
        };
        setSettings({
            ...settings,
            slides: [...settings.slides, newSlide]
        });
        setEditingSlideId(newSlide.id);
    };

    const deleteSlide = (id: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            slides: settings.slides.filter(s => s.id !== id)
        });
    };

    const toggleSlideActive = (id: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            slides: settings.slides.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
        });
    };

    const moveSlide = (id: string, direction: 'up' | 'down') => {
        if (!settings) return;
        const index = settings.slides.findIndex(s => s.id === id);
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === settings.slides.length - 1) return;

        const newSlides = [...settings.slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
        
        const orderedSlides = newSlides.map((s, i) => ({ ...s, order: i }));
        
        setSettings({
            ...settings,
            slides: orderedSlides
        });
    };

    const updateSlideField = (slideId: string, section: 'expert' | 'customer' | 'testimonial', field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            slides: settings.slides.map(s => {
                if (s.id === slideId) {
                    return {
                        ...s,
                        [section]: {
                            ...(s[section as keyof UserTestimonialSlide] as object),
                            [field]: value
                        }
                    };
                }
                return s;
            })
        });
    };

    const handleLanguagesChange = (slideId: string, section: 'expert' | 'customer', value: string) => {
        const langs = value.split(',').map(l => l.trim()).filter(l => l !== '');
        updateSlideField(slideId, section, 'languages', langs);
    };

    if (isLoading) return <div className="p-8 text-muted-foreground">Loading testimonials settings...</div>;
    if (!settings) return <div className="p-8 text-destructive">Error: Settings not initialized</div>;

    return (
        <div className="space-y-8 max-w-5xl pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Page Testimonials</h1>
                    <p className="text-muted-foreground">Manage the testimonial carousel slides on the /user page.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={addSlide}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Slide
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isUploading}>
                        {isSaving ? "Saving..." : "Save All Changes"}
                        <Save className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {settings.slides.length === 0 ? (
                    <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                        <Megaphone className="w-12 h-12 mb-4 opacity-20" />
                        <p>No slides created yet.</p>
                        <Button variant="link" onClick={addSlide} className="mt-2">Create your first slide</Button>
                    </div>
                ) : (
                    settings.slides.map((slide, index) => (
                        <Card key={slide.id} className={cn("overflow-hidden border-border/40", !slide.isActive && "opacity-60")}>
                            <CardHeader className="py-3 px-4 bg-muted/30 flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSlide(slide.id, 'up')} disabled={index === 0}>
                                            <ArrowUp className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveSlide(slide.id, 'down')} disabled={index === settings.slides.length - 1}>
                                            <ArrowDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="font-bold text-sm">Slide #{index + 1}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{slide.expert.name} & {slide.customer.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 mr-4">
                                        <Switch checked={slide.isActive} onCheckedChange={() => toggleSlideActive(slide.id)} />
                                        <span className="text-xs font-medium">{slide.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingSlideId(editingSlideId === slide.id ? null : slide.id)}>
                                        {editingSlideId === slide.id ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteSlide(slide.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            
                            {editingSlideId === slide.id && (
                                <CardContent className="p-6 space-y-8 animate-in slide-in-from-top-2 duration-300">
                                    {/* Expert Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-accent border-b pb-2">Expert Information (Left Column)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1 flex flex-col gap-3">
                                                <Label>Expert Avatar</Label>
                                                <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/10 relative">
                                                    <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                                                        <AvatarImage src={slide.expert.avatarUrl} className="object-cover" />
                                                        <AvatarFallback><User className="w-10 h-10 opacity-20" /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="relative group">
                                                            <Button variant="outline" size="sm" className="w-full relative overflow-hidden">
                                                                <Upload className="w-3 h-3 mr-2" />
                                                                Upload Image
                                                                <input 
                                                                    type="file" 
                                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                                    accept="image/*"
                                                                    onChange={(e) => e.target.files?.[0] && handleImageUpload(slide.id, 'expert', e.target.files[0])}
                                                                    disabled={isUploading}
                                                                />
                                                            </Button>
                                                        </div>
                                                        <Input 
                                                            placeholder="or paste URL" 
                                                            className="text-xs h-7" 
                                                            value={slide.expert.avatarUrl} 
                                                            onChange={(e) => updateSlideField(slide.id, 'expert', 'avatarUrl', e.target.value)} 
                                                        />
                                                    </div>
                                                </div>
                                                {isUploading && editingSlideId === slide.id && <Progress value={uploadProgress} className="h-1" />}
                                            </div>
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Expert Name</Label>
                                                    <Input value={slide.expert.name} onChange={(e) => updateSlideField(slide.id, 'expert', 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role Label</Label>
                                                    <Input value={slide.expert.roleLabel} onChange={(e) => updateSlideField(slide.id, 'expert', 'roleLabel', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Verified Label</Label>
                                                    <Input value={slide.expert.verifiedLabel} onChange={(e) => updateSlideField(slide.id, 'expert', 'verifiedLabel', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Sessions Label</Label>
                                                    <Input value={slide.expert.sessionsLabel} onChange={(e) => updateSlideField(slide.id, 'expert', 'sessionsLabel', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label>Country Code (ISO)</Label>
                                                <Input 
                                                    value={slide.expert.countryCode} 
                                                    onChange={(e) => updateSlideField(slide.id, 'expert', 'countryCode', e.target.value.toUpperCase())} 
                                                    placeholder="e.g. UA, PL"
                                                    maxLength={2}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Country Name</Label>
                                                <Input value={slide.expert.countryName} onChange={(e) => updateSlideField(slide.id, 'expert', 'countryName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Languages</Label>
                                                <Input value={slide.expert.languages.join(', ')} onChange={(e) => handleLanguagesChange(slide.id, 'expert', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Rating</Label>
                                                <Input type="number" step="0.1" value={slide.expert.rating} onChange={(e) => updateSlideField(slide.id, 'expert', 'rating', parseFloat(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-accent border-b pb-2">Customer Information (Right Column)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-1 flex flex-col gap-3">
                                                <Label>Customer Avatar</Label>
                                                <div className="flex items-center gap-4 p-4 border rounded-xl bg-muted/10 relative">
                                                    <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                                                        <AvatarImage src={slide.customer.avatarUrl} className="object-cover" />
                                                        <AvatarFallback><User className="w-10 h-10 opacity-20" /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="relative group">
                                                            <Button variant="outline" size="sm" className="w-full relative overflow-hidden">
                                                                <Upload className="w-3 h-3 mr-2" />
                                                                Upload Image
                                                                <input 
                                                                    type="file" 
                                                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                                                    accept="image/*"
                                                                    onChange={(e) => e.target.files?.[0] && handleImageUpload(slide.id, 'customer', e.target.files[0])}
                                                                    disabled={isUploading}
                                                                />
                                                            </Button>
                                                        </div>
                                                        <Input 
                                                            placeholder="or paste URL" 
                                                            className="text-xs h-7" 
                                                            value={slide.customer.avatarUrl} 
                                                            onChange={(e) => updateSlideField(slide.id, 'customer', 'avatarUrl', e.target.value)} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Customer Name</Label>
                                                    <Input value={slide.customer.name} onChange={(e) => updateSlideField(slide.id, 'customer', 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role Label</Label>
                                                    <Input value={slide.customer.roleLabel} onChange={(e) => updateSlideField(slide.id, 'customer', 'roleLabel', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>City / Location</Label>
                                                    <Input value={slide.customer.city || ''} onChange={(e) => updateSlideField(slide.id, 'customer', 'city', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Sessions Label</Label>
                                                    <Input value={slide.customer.sessionsLabel} onChange={(e) => updateSlideField(slide.id, 'customer', 'sessionsLabel', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label>Country Code (ISO)</Label>
                                                <Input 
                                                    value={slide.customer.countryCode} 
                                                    onChange={(e) => updateSlideField(slide.id, 'customer', 'countryCode', e.target.value.toUpperCase())} 
                                                    placeholder="UA, PL..."
                                                    maxLength={2}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Languages</Label>
                                                <Input value={slide.customer.languages.join(', ')} onChange={(e) => handleLanguagesChange(slide.id, 'customer', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Rating Label</Label>
                                                <Input value={slide.customer.ratingLabel} onChange={(e) => updateSlideField(slide.id, 'customer', 'ratingLabel', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Rating</Label>
                                                <Input type="number" step="0.1" value={slide.customer.rating} onChange={(e) => updateSlideField(slide.id, 'customer', 'rating', parseFloat(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial Content Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-accent border-b pb-2">Testimonial Content (Center Column)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Title Label</Label>
                                                <Input value={slide.testimonial.title} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Offer ID Label</Label>
                                                <Input value={slide.testimonial.offerIdLabel} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'offerIdLabel', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Communication Type</Label>
                                                <Input value={slide.testimonial.communicationType} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'communicationType', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category Label</Label>
                                                <Input value={slide.testimonial.categoryLabel} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'categoryLabel', e.target.value)} />
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 border rounded-xl bg-muted/10 space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-bold">Expert Testimonial Snippet (Top)</Label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">Rating:</span>
                                                        <Input className="w-16 h-8 text-xs" type="number" step="0.1" value={slide.testimonial.firstRating} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'firstRating', parseFloat(e.target.value))} />
                                                    </div>
                                                </div>
                                                <textarea 
                                                    className="w-full min-h-[80px] p-3 text-sm border rounded-lg bg-background" 
                                                    value={slide.testimonial.firstText} 
                                                    onChange={(e) => updateSlideField(slide.id, 'testimonial', 'firstText', e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-bold">Customer Testimonial Snippet (Bottom)</Label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">Rating:</span>
                                                        <Input className="w-16 h-8 text-xs" type="number" step="0.1" value={slide.testimonial.secondRating} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'secondRating', parseFloat(e.target.value))} />
                                                    </div>
                                                </div>
                                                <textarea 
                                                    className="w-full min-h-[80px] p-3 text-sm border rounded-lg bg-background" 
                                                    value={slide.testimonial.secondText} 
                                                    onChange={(e) => updateSlideField(slide.id, 'testimonial', 'secondText', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Communication Date Label</Label>
                                            <Input value={slide.testimonial.communicationDateLabel} onChange={(e) => updateSlideField(slide.id, 'testimonial', 'communicationDateLabel', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>
            
            <div className="fixed bottom-8 right-8 z-50">
                <Button size="lg" className="shadow-2xl h-14 px-8 rounded-full" onClick={handleSave} disabled={isSaving || isUploading}>
                    {isSaving ? "Saving..." : "Save All Changes"}
                    <Save className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}
