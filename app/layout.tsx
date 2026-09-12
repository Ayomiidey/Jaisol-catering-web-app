import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Authentic West African Catering',
  description:
    'Order authentic West African cuisine and book catering services across the UK',
  icons: {
    icon: '/icon.png',
  },
}


export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#ffffff',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#101216',
    },
  ],
}
// export const viewport: Viewport = {
//   colorScheme: 'dark',
//   themeColor: [
//     {
//       media: '(prefers-color-scheme: dark)',
//       color: '#1a1a1a',
//     },
//   ],
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>

        <Analytics />
      </body>
    </html>
  )
}
