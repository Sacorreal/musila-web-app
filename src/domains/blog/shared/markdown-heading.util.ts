import GithubSlugger from 'github-slugger'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm

/** Extrae los headings h2/h3 del Markdown para el TOC, generando los mismos ids que `rehype-slug` asigna al renderizar (ambos usan github-slugger con el mismo orden de aparición). */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const slugger = new GithubSlugger()
  const headings: MarkdownHeading[] = []
  let match: RegExpExecArray | null

  while ((match = HEADING_REGEX.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim().replace(/[*_`]/g, '')
    headings.push({ id: slugger.slug(text), text, level })
  }

  return headings
}
