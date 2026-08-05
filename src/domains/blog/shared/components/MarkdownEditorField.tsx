'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import '@uiw/react-md-editor/markdown-editor.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  value: string
  onChange: (value: string) => void
  height?: number
}

export function MarkdownEditorField({ value, onChange, height = 420 }: Props) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <div data-color-mode={mounted && resolvedTheme === 'dark' ? 'dark' : 'light'}>
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        height={height}
        preview="live"
      />
    </div>
  )
}
