'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { languages } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang === 'es' ? 'Español' : 'Català'}
          </option>
        ))}
      </select>
      <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
}
