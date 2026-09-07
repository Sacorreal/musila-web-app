import Image from 'next/image'
import Link from 'next/link'
import type { BlogAuthorDto } from '../../shared/blog.types'

interface Props {
  author: BlogAuthorDto
  variant?: 'compact' | 'full'
}

export function AuthorCard({ author, variant = 'compact' }: Props) {
  const isFull = variant === 'full'
  const avatarSize = isFull ? 96 : 56

  return (
    <div
      className={
        isFull
          ? 'flex flex-col items-start gap-4 sm:flex-row sm:items-center'
          : 'flex items-center gap-4 rounded-2xl border border-border bg-card p-5'
      }
    >
      <div
        className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-border"
        style={{ width: avatarSize, height: avatarSize }}
      >
        {author.avatarUrl ? (
          <Image src={author.avatarUrl} alt={author.name} fill sizes={`${avatarSize}px`} className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-lg font-bold text-muted-foreground">
            {author.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <Link
          href={`/blog/authors/${author.slug}`}
          className={isFull ? 'text-2xl font-bold text-foreground hover:text-primary' : 'text-sm font-semibold text-foreground hover:text-primary'}
        >
          {author.name}
        </Link>
        <p className={isFull ? 'mt-1 text-base text-muted-foreground' : 'text-xs text-muted-foreground'}>{author.role}</p>
        {isFull && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/80">{author.bio}</p>}
      </div>
    </div>
  )
}
