import { ArticleEditForm } from "../../_components/article-edit-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Article</h1>
      </div>
      <ArticleEditForm />
    </div>
  );
}
