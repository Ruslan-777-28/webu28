import { Button } from "@/components/ui/button";
import { AllArticlesTable } from "../_components/all-articles-table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function AllArticlesPage() {
    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Articles</h1>
                <Link href="/admin/blog/articles/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </Link>
            </div>
            <AllArticlesTable />
        </div>
    );
}
