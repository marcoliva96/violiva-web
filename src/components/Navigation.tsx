'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { LanguageSelector } from '@/components/LanguageSelector'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const pathname = usePathname()

  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-amber-100 p-2 rounded-full">
              <Image 
                src="/icono_violin.png" 
                alt="Violín" 
                width={24} 
                height={24} 
                className="text-amber-600"
              />
            </div>
            <span className="text-xl font-serif font-bold text-gray-900">
              Violiva music
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/galeria" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/galeria') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.gallery')}
            </Link>
            <Link 
              href="/escuchar" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/escuchar') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.listen')}
            </Link>
            <Link 
              href="/disponibilidad" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/disponibilidad') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.availability')}
            </Link>
            <Link 
              href="/contacto" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/contacto') 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.contact')}
            </Link>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/configura">Configura tu boda</Link>
            </Button>
            <LanguageSelector />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/galeria" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/galeria') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t('nav.gallery')}
              </Link>
              <Link 
                href="/escuchar" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/escuchar') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t('nav.listen')}
              </Link>
              <Link 
                href="/disponibilidad" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/disponibilidad') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t('nav.availability')}
              </Link>
              <Link 
                href="/contacto" 
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/contacto') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white w-full">
                <Link href="/configura" onClick={() => setIsOpen(false)}>
                  {t('nav.configure')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
