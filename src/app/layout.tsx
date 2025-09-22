import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Violiva - Música para tu boda',
  description: 'Crea el momento perfecto con música en vivo que hará inolvidable tu día especial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LanguageProvider>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  )
}