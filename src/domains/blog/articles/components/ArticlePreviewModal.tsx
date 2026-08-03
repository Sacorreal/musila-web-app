'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/shared/components/UI/dialog'
import { MarkdownRenderer } from '../../shared/components/MarkdownRenderer'
import { YoutubeEmbed } from '../../shared/components/YoutubeEmbed'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  contentMarkdown: string
  youtubeUrl?: string
  coverPreviewUrl?: string | null
}

export function ArticlePreviewModal({ isOpen, onClose, title, contentMarkdown, youtubeUrl, coverPreviewUrl }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista previa</DialogTitle>
        </DialogHeader>
        <article className="space-y-6 pt-2">
          {coverPreviewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreviewUrl} alt={title} className="w-full rounded-xl object-cover" />
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title || 'Sin título'}</h1>
          {youtubeUrl && <YoutubeEmbed url={youtubeUrl} />}
          <MarkdownRenderer content={contentMarkdown || '_Sin contenido todavía._'} />
        </article>
      </DialogContent>
    </Dialog>
  )
}
