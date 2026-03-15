import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const categories = [
    { name: 'таро', slug: 'taro' },
    { name: 'астрологія', slug: 'astrology' },
    { name: 'шаман', slug: 'shaman' },
    { name: 'ретрит', slug: 'retreat' },
    { name: 'гадання', slug: 'divination' },
    { name: 'нумерологія', slug: 'numerology' },
];

export default function CategoriesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/blog/settings">
                  <Button variant="outline">
                    Manage Categories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        This is a read-only list of blog categories. To add, edit, or remove categories, please go to the <Link href="/admin/blog/settings" className="underline">Blog Settings</Link> page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* This data should be fetched from blogSettings/main in a real app */}
                            {categories.map((cat) => (
                                <TableRow key={cat.slug}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
