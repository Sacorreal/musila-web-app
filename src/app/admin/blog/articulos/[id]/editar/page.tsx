'use client'

import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { adminBlogArticlesHooks } from '@/src/domains/blog/articles/admin-blog-articles.hooks'
import { ArticleForm } from '@/src/domains/blog/articles/components/ArticleForm'

export default function AdminEditBlogArticlePage() {
  const params = useParams<{ id: string }>()
  const { data: article, isLoading } = adminBlogArticlesHooks.useAdminBlogArticle(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Editar Artículo</h2>
        <p className="text-sm text-muted-foreground">Actualiza el contenido del artículo.</p>
      </div>

      {isLoading || !article ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ArticleForm key={article.id} initialData={article} />
      )}
    </div>
  )
}
