'use client'

import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { adminBlogAuthorsHooks } from '@/src/domains/blog/authors/admin-blog-authors.hooks'
import { AuthorForm } from '@/src/domains/blog/authors/components/AuthorForm'

export default function AdminEditBlogAuthorPage() {
  const params = useParams<{ id: string }>()
  const { data: author, isLoading } = adminBlogAuthorsHooks.useAdminBlogAuthor(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Editar Autor</h2>
        <p className="text-sm text-muted-foreground">Actualiza los datos del autor editorial.</p>
      </div>

      {isLoading || !author ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AuthorForm key={author.id} initialData={author} />
      )}
    </div>
  )
}
