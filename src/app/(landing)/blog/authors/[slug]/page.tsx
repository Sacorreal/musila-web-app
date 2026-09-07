import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingHeader } from '@/src/domains/landing/components/landing-header'
import { Footer } from '@/src/domains/landing/components/footer'
import { SITE_URL } from '@/src/shared/constants/env'
import { fetchAuthorArticles, fetchAuthorBySlug } from '@/src/domains/blog/authors/blog-authors.actions'
import { AuthorCard } from '@/src/domains/blog/authors/components/AuthorCard'
import { ArticleCard } from '@/src/domains/blog/articles/components/ArticleCard'
import { Breadcrumbs } from '@/src/shared/components/UI/Breadcrumbs'

const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/logo.png`

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const author = await fetchAuthorBySlug(slug)
    if (!author) return { title: 'Músila Blog - Autor no encontrado' }

    const description = `${author.role} en Músila. ${author.bio}`.slice(0, 200)

    return {
      title: `${author.name} | Blog Músila`,
      description,
      alternates: { canonical: `${SITE_URL}/blog/authors/${author.slug}` },
      openGraph: {
        title: author.name,
        description,
        images: [{ url: author.avatarUrl ?? DEFAULT_OG_IMAGE_URL, width: 400, height: 400, alt: author.name }],
        type: 'profile',
        siteName: 'Músila',
      },
      twitter: {
        card: 'summary',
        title: author.name,
        description,
        images: [author.avatarUrl ?? DEFAULT_OG_IMAGE_URL],
      },
    }
  } catch {
    return { title: 'Blog Músila' }
  }
}

export default async function BlogAuthorProfilePage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const limit = 9

  const author = await fetchAuthorBySlug(slug)
  if (!author) notFound()

  const { data: articles, total } = await fetchAuthorArticles(slug, page, limit)
  const totalPages = Math.ceil(total / limit)

  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: 'Autores', href: '/blog' }, { label: author.name }]} />

        <div className="mt-6">
          <AuthorCard author={author} variant="full" />
        </div>

        <div className="mt-10 border-t border-border pt-10">
          {articles.length === 0 ? (
            <p className="text-center text-muted-foreground">Este autor todavía no tiene artículos publicados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    href={`/blog/authors/${slug}?page=${pageNumber}`}
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
      </div>

      <Footer />
    </main>
  )
}
