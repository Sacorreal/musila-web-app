import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LandingHeader } from '@/src/domains/landing/components/landing-header'
import { Footer } from '@/src/domains/landing/components/footer'
import { SITE_URL } from '@/src/shared/constants/env'
import { fetchArticleBySlug } from '@/src/domains/blog/articles/blog-articles.actions'
import { extractHeadings } from '@/src/domains/blog/shared/markdown-heading.util'
import { MarkdownRenderer } from '@/src/domains/blog/shared/components/MarkdownRenderer'
import { TableOfContents } from '@/src/domains/blog/shared/components/TableOfContents'
import { YoutubeEmbed } from '@/src/domains/blog/shared/components/YoutubeEmbed'
import { RelatedServicesSection } from '@/src/domains/blog/tags/components/RelatedServicesSection'
import { AuthorCard } from '@/src/domains/blog/authors/components/AuthorCard'
import { Breadcrumbs } from '@/src/shared/components/UI/Breadcrumbs'

const DEFAULT_OG_IMAGE_URL = `${SITE_URL}/logo.png`

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const article = await fetchArticleBySlug(slug)
    if (!article) return { title: 'Músila Blog - Artículo no encontrado' }

    const coverUrl = article.coverImageUrl ?? DEFAULT_OG_IMAGE_URL
    const canonicalUrl = `${SITE_URL}/blog/${article.slug}`

    return {
      title: `${article.title} | Blog Músila`,
      description: article.excerpt,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: canonicalUrl,
        images: [{ url: coverUrl, width: 1200, height: 630, alt: article.title }],
        type: 'article',
        siteName: 'Músila',
        publishedTime: article.publishedAt ?? undefined,
        authors: article.authors.map((author) => author.name),
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: [coverUrl],
      },
    }
  } catch {
    return { title: 'Blog Músila' }
  }
}

export default async function BlogArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) notFound()

  const headings = extractHeadings(article.contentMarkdown)
  const mainAuthor = article.authors[0]

  return (
    <main className="min-h-screen bg-background">
      <LandingHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: article.title }]} />

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{article.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{article.readingTimeMinutes} min de lectura</span>
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="order-2 space-y-6 lg:order-1">
            <div className="lg:sticky lg:top-24 lg:space-y-6">
              <TableOfContents headings={headings} />
              <RelatedServicesSection tags={article.tags} />
            </div>
          </aside>

          <article className="order-1 min-w-0 lg:order-2">
            {article.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="mb-8 aspect-video w-full rounded-2xl object-cover"
              />
            )}

            {article.youtubeUrl && <YoutubeEmbed url={article.youtubeUrl} />}

            <MarkdownRenderer content={article.contentMarkdown} />

            {mainAuthor && (
              <div className="mt-12 border-t border-border pt-8">
                <AuthorCard author={mainAuthor} variant="compact" />
              </div>
            )}
          </article>
        </div>
      </div>

      <Footer />
    </main>
  )
}
