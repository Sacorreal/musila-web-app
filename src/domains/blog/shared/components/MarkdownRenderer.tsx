import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeSanitize from 'rehype-sanitize'

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-5 leading-relaxed text-foreground/90">{children}</p>,
  ul: ({ children }) => <ul className="mb-5 ml-6 list-disc space-y-2 text-foreground/90">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-2 text-foreground/90">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-5 border-l-4 border-primary/40 bg-muted/40 py-2 pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-5 overflow-x-auto rounded-xl bg-muted p-4 text-sm">{children}</pre>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  img: ({ src, alt }) => (
    // Imagen de contenido con dimensiones arbitrarias definidas por el autor: no usa next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} loading="lazy" className="my-6 w-full rounded-xl" />
  ),
  a: ({ href, children }) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    )
  },
}

interface Props {
  content: string
}

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className="max-w-none text-base">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeSanitize]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
