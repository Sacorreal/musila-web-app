import Image from 'next/image'
import Link from 'next/link'
import type { BlogArticleDto } from '../../shared/blog.types'

interface Props {
  article: BlogArticleDto
}

export function ArticleCard({ article }: Props) {
  const authorNames = article.authors.map((author) => author.name).join(' · ')

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Sin imagen</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
          {article.title}
        </h3>
        {authorNames && <p className="text-xs text-muted-foreground">{authorNames}</p>}
      </div>
    </Link>
  )
}
