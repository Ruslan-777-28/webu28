'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, HelpCircle, Users } from 'lucide-react';
import Link from 'next/link';

const contentPages = [
    {
        title: "'FOR EXPERTS' Page",
        description: "Edit content blocks on the /pro page.",
        href: "/admin/content/pro",
        icon: Users
    },
    {
        title: "FAQ Management",
        description: "Create, edit, and manage all FAQ items.",
        href: "/admin/content/faq",
        icon: HelpCircle
    }
];

export default function ContentAdminPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">
                Select a content section to manage.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentPages.map((page) => (
                <Link key={page.href} href={page.href}>
                    <Card className="h-full hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                             <div className="bg-background p-3 rounded-lg border">
                                <page.icon className="h-6 w-6 text-accent" />
                            </div>
                            <CardTitle>{page.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{page.description}</CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
