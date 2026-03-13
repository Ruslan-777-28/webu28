import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, LayoutList, Users, BookMarked } from "lucide-react";
import { AllArticlesTable } from "./_components/all-articles-table";

export default function BlogAdminDashboard() {

  const stats = [
    { title: "Total Articles", value: 125, icon: Newspaper },
    { title: "Published", value: 85, icon: BookMarked },
    { title: "Drafts", value: 30, icon: LayoutList },
    { title: "Authors", value: 10, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
            <AllArticlesTable showFilters={false} />
        </CardContent>
      </Card>
    </div>
  );
}
