'use client'

import { ArticleForm } from '@/src/domains/blog/articles/components/ArticleForm'

export default function AdminNewBlogArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Nuevo Artículo</h2>
        <p className="text-sm text-muted-foreground">Crea un nuevo artículo para el blog.</p>
      </div>
      <ArticleForm />
    </div>
  )
}
