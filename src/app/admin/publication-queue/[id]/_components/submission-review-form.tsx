'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Post, BlogCategory, EditorialStatus } from "@/lib/types";
import { useUser } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Clock, FileText, Send, User, XCircle } from 'lucide-react';

const statusInfo: Record<EditorialStatus, { icon: React.ElementType, color: string, label: string, description: string }> = {
    submitted: { icon: Send, color: 'text-blue-600', label: 'Submitted', description: 'This post is waiting for review.' },
    under_review: { icon: FileText, color: 'text-yellow-600', label: 'Under Review', description: 'This post is currently being reviewed.' },
    revision: { icon: AlertCircle, color: 'text-orange-600', label: 'Changes Requested', description: 'The author needs to make changes before this can be published.' },
    rejected: { icon: XCircle, color: 'text-red-600', label: 'Rejected', description: 'This post has been rejected and will not be published.' },
    published: { icon: CheckCircle, color: 'text-green-600', label: 'Published', description: 'This post is live on the site.' },
};

async function moderatePost(postId: string, action: string, payload: any, token: string) {
    const response = await fetch('/api/admin/moderate-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, action, payload }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to moderate post.');
    }
    return response.json();
}

export function SubmissionReviewForm({ post, categories }: { post: Post & { id: string }, categories: BlogCategory[] }) {
    const { toast } = useToast();
    const { user: adminUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [revisionMessage, setRevisionMessage] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const getCategoryPath = (categoryId?: string, subcategoryId?: string) => {
        if (!categoryId || !categories) return 'N/A';
        const category = categories.find(c => c.id === categoryId);
        if (!category) return categoryId;
        if (subcategoryId) {
            const subcategory = category.subcategories?.find(s => s.id === subcategoryId);
            return subcategory ? `${category.name} / ${subcategory.name}` : `${category.name} / ${subcategoryId}`;
        }
        return category.name;
    };

    const handleAction = async (action: 'MARK_AS_UNDER_REVIEW' | 'REQUEST_CHANGES' | 'REJECT' | 'APPROVE_FOR_PUBLICATION', payload?: any) => {
        if (!adminUser) {
            toast({ variant: 'destructive', title: 'Authentication Error' });
            return;
        }
        setIsLoading(true);
        try {
            const token = await adminUser.getIdToken();
            await moderatePost(post.id, action, payload, token);
            toast({ title: 'Action Successful', description: `Post has been updated.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error Performing Action', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const currentStatus = post.editorialStatus || 'submitted';
    const statusDetails = statusInfo[currentStatus];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        {post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} width={800} height={450} className="rounded-lg object-cover w-full aspect-video mb-4" />}
                        <CardTitle className="text-4xl">{post.title}</CardTitle>
                        <CardDescription>
                            Category: <Badge variant="outline">{getCategoryPath(post.categoryId, post.subcategoryId)}</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-stone dark:prose-invert max-w-none">
                        <p className="lead">{post.excerpt}</p>
                        {post.content}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <statusDetails.icon className={cn("w-6 h-6", statusDetails.color)} />
                           {statusDetails.label}
                        </CardTitle>
                        <CardDescription>{statusDetails.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-4">
                        {post.revisionRequested && post.revisionMessage && (
                             <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                                <p className="font-bold text-orange-800">Changes Requested:</p>
                                <p className="italic">"{post.revisionMessage}"</p>
                            </div>
                        )}
                        {post.editorialStatus === 'rejected' && post.moderationNotes && (
                             <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="font-bold text-red-800">Rejection Reason:</p>
                                <p className="italic">"{post.moderationNotes}"</p>
                            </div>
                        )}
                        <div>
                            <p className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Author: <strong>{post.authorName}</strong></p>
                            <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> Submitted: {post.createdAt?.toDate().toLocaleString()}</p>
                            {post.moderationUpdatedAt && (
                                 <p className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /> Last Update: {post.moderationUpdatedAt?.toDate().toLocaleString()}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Moderation Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                         {currentStatus === 'submitted' && (
                            <Button onClick={() => handleAction('MARK_AS_UNDER_REVIEW')} disabled={isLoading} className="w-full">
                                Mark as Under Review
                            </Button>
                         )}
                         {currentStatus !== 'published' && currentStatus !== 'rejected' && (
                            <>
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="outline" className="w-full">Request Changes</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Request Changes</DialogTitle><DialogDescription>Provide clear feedback for the author.</DialogDescription></DialogHeader>
                                        <Textarea placeholder="e.g., 'Please add more details to the second paragraph...'" value={revisionMessage} onChange={(e) => setRevisionMessage(e.target.value)} />
                                        <DialogFooter>
                                            <Button onClick={() => handleAction('REQUEST_CHANGES', { revisionMessage })} disabled={isLoading || !revisionMessage}>Send Feedback</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="destructive" outline className="w-full">Reject</Button></DialogTrigger>
                                     <DialogContent>
                                        <DialogHeader><DialogTitle>Reject Submission</DialogTitle><DialogDescription>Provide an internal reason for rejection.</DialogDescription></DialogHeader>
                                        <Textarea placeholder="Internal notes for rejection reason..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                                        <DialogFooter>
                                            <Button variant="destructive" onClick={() => handleAction('REJECT', { moderationNotes: rejectionReason })} disabled={isLoading || !rejectionReason}>Confirm Rejection</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                
                                <Button onClick={() => handleAction('APPROVE_FOR_PUBLICATION')} disabled={isLoading} className="w-full">
                                    Approve and Publish
                                </Button>
                            </>
                         )}
                         {currentStatus === 'rejected' && (
                             <Button onClick={() => handleAction('MARK_AS_UNDER_REVIEW')} disabled={isLoading} variant="secondary" className="w-full">
                                Re-review
                            </Button>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
