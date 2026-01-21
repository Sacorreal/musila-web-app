import { PlayerProvider } from "@/src/domains/player/player.context"
import { Toaster } from "@/src/shared/ui/sonner"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Músila - Canciones inéditas para el mundo",
  description:
    "Plataforma donde compositores publican canciones inéditas e intérpretes pueden solicitar su uso para grabarlas.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#d4a853",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        <PlayerProvider>
          {children}
          <Toaster position="bottom-right" />
        </PlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
