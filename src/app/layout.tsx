

import { Toaster } from "@/src/shared/components/UI/sonner"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import { Providers } from "../shared/components/Layout/provider"
import { PlayerProvider } from "@/src/domains/player/player.context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Músila - Canciones inéditas para el mundo",
  description:
    "Plataforma donde compositores publican canciones inéditas e intérpretes pueden solicitar su uso para grabarlas.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <Providers>
          <PlayerProvider>
            {children}
            <Toaster position="bottom-right" />
            <Analytics />
          </PlayerProvider>
        </Providers>
      </body>
    </html>
  )
}
