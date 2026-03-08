import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Serif_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Gita Wisdom Hub - Divine Knowledge from Bhagavad Gita',
  description: 'Explore all 700 slokas from the Bhagavad Gita with translations in 10 languages, audio recitation, and practical wisdom for modern life. Experience divine knowledge from Lord Krishna.',
  keywords: ['Bhagavad Gita', 'Krishna', 'Spiritual Wisdom', 'Hindu Scripture', 'Meditation', 'Karma Yoga', 'Dharma'],
  authors: [{ name: 'Gita Wisdom Hub' }],
  openGraph: {
    title: 'Gita Wisdom Hub - Divine Knowledge from Bhagavad Gita',
    description: 'All 700 slokas with translations, audio, and practical wisdom',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} ${notoSerifDevanagari.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
