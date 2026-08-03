import type { Metadata } from 'next'
import { LandingHeader } from '@/src/domains/landing/components/landing-header'
import { Footer } from '@/src/domains/landing/components/footer'
import { fetchPublicArticles } from '@/src/domains/blog/articles/blog-articles.actions'
import { ArticleCard } from '@/src/domains/blog/articles/components/ArticleCard'
import { Breadcrumbs } from '@/src/shared/components/UI/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Blog | Músila',
  description: 'Artículos, novedades y guías sobre licenciamiento musical de Músila.',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const limit = 12

  const { data: articles, total } = await fetchPublicArticles(page, limit)
  const totalPages = Math.ceil(total / limit)

  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <Breadcrumbs items={[{ label: 'Blog' }]} />

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Blog</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Novedades, guías y buenas prácticas sobre licenciamiento musical.
        </p>

        {articles.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">Todavía no hay artículos publicados.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1
              return (
                <a
                  key={pageNumber}
                  href={`/blog?page=${pageNumber}`}
                  className={
                    pageNumber === page
                      ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground'
                      : 'flex h-9 w-9 items-center justify-center rounded-lg text-sm text-muted-foreground hover:bg-muted'
                  }
                >
                  {pageNumber}
                </a>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
