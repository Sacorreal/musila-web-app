"use client"

import { apiClient } from "@/src/shared/libs/axios/axios-client"
import { cn } from "@/src/shared/libs/cn"
import { Music, Search, User, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

interface TrackResult {
  id: string
  title: string
  genre?: { genre: string }
}

interface AuthorResult {
  id: string
  name: string
  lastName: string
  email: string
}

interface SearchResults {
  tracks: TrackResult[]
  authors: AuthorResult[]
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function SearchBox() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 350)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null)
      setOpen(false)
      return
    }
    setLoading(true)
    apiClient
      .get<SearchResults>(`/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        setResults(res.data)
        setOpen(true)
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const clear = useCallback(() => {
    setQuery("")
    setResults(null)
    setOpen(false)
  }, [])

  const handleSelect = useCallback(
    (type: "track" | "author", id: string) => {
      setOpen(false)
      setQuery("")
      if (type === "track") router.push(`/music/tracks/${id}`)
      else router.push(`/music/authors/${id}`)
    },
    [router]
  )

  const hasResults =
    results && (results.tracks.length > 0 || results.authors.length > 0)

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasResults && setOpen(true)}
          placeholder="Buscar tracks o autores..."
          className={cn(
            "w-full h-10 pl-9 pr-9 rounded-xl border border-border bg-muted/50",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-12 left-0 right-0 z-50 rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          {loading && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Buscando...
            </div>
          )}

          {!loading && !hasResults && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Sin resultados para &quot;{query}&quot;
            </div>
          )}

          {!loading && hasResults && (
            <div className="max-h-80 overflow-y-auto">
              {/* Tracks */}
              {results!.tracks.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Tracks
                  </p>
                  {results!.tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleSelect("track", track.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-primary/15 text-primary">
                        <Music className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {track.title}
                        </p>
                        {track.genre?.genre && (
                          <p className="text-xs text-muted-foreground truncate">
                            {track.genre.genre}
                          </p>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        Track
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Authors */}
              {results!.authors.length > 0 && (
                <div>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Autores
                  </p>
                  {results!.authors.map((author) => (
                    <button
                      key={author.id}
                      onClick={() => handleSelect("author", author.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-left"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/15 text-blue-500">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {author.name} {author.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {author.email}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                        Autor
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
