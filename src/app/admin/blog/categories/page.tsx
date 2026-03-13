import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const categories = [
    { name: 'таро', slug: 'taro', articlesCount: 15, isVisible: true },
    { name: 'астрологія', slug: 'astrology', articlesCount: 22, isVisible: true },
    { name: 'шаман', slug: 'shaman', articlesCount: 8, isVisible: true },
    { name: 'ретрит', slug: 'retreat', articlesCount: 5, isVisible: false },
    { name: 'гадання', slug: 'divination', articlesCount: 12, isVisible: true },
    { name: 'нумерологія', slug: 'numerology', articlesCount: 18, isVisible: true },
];

export default function CategoriesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Category
                </Button>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Articles</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.slug}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                    <TableCell className="text-center">{cat.articlesCount}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={cat.isVisible ? "secondary" : "outline"}>
                                            {cat.isVisible ? "Visible" : "Hidden"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
