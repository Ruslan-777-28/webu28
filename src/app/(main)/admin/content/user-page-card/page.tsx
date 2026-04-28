'use client';

import { CardSectionForm } from '../_components/card-section-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserPageCardAdmin() {
  return (
    <div className="space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
            <Link href="/admin/content" className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
                <h1 className="text-3xl font-bold">User Page Card</h1>
                <p className="text-muted-foreground">Manage the live feed card section on the Community page.</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Block: "Картка"</CardTitle>
                <CardDescription>
                    Edit the text and carousel images for the User Page live feed section.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CardSectionForm docId="forCommunity" />
            </CardContent>
        </Card>
    </div>
  );
}
