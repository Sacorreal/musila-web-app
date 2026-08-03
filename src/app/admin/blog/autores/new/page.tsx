'use client'

import { AuthorForm } from '@/src/domains/blog/authors/components/AuthorForm'

export default function AdminNewBlogAuthorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black tracking-tight">Nuevo Autor</h2>
        <p className="text-sm text-muted-foreground">Registra un nuevo autor editorial del blog.</p>
      </div>
      <AuthorForm />
    </div>
  )
}
