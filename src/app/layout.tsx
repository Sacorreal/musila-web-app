

import { Toaster } from "@/src/shared/components/UI/sonner"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Suspense } from "react"
import "./globals.css"
import { Providers } from "../shared/components/Layout/provider"
import { PlayerProvider } from "@/src/domains/player/player.context"
import { ReferralCapture } from "@/src/shared/components/ReferralCapture"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://musila.co"),
  title: {
    default: "Músila - ¡Dale vida a la música!",
    template: "%s | Músila",
  },
  description:
    "Somos la plataforma digital para el descubrimiento de canciones inéditas de todos los géneros musicales.",
  keywords: [
    "música inédita",
    "compositores",
    "intérpretes",
    "industria musical",
    "canciones originales",
    "Músila",
  ],
  authors: [{ name: "Músila" }],
  creator: "Músila",
  publisher: "Músila",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://musila.co",
    title: "Músila - ¡Dale vida a la música!",
    description:  "Somos la plataforma digital para el descubrimiento de canciones inéditas de todos los géneros musicales.",
    siteName: "Músila",
  },
  twitter: {
    card: "summary_large_image",
    title: "Músila - ¡Dale vida a la música!",
    description:  "Somos la plataforma digital para el descubrimiento de canciones inéditas de todos los géneros musicales.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
            <Suspense fallback={null}>
              <ReferralCapture />
            </Suspense>
            {children}
            <Toaster position="bottom-right" />
            <Analytics />
          </PlayerProvider>
        </Providers>
      </body>
    </html>
  )
}
