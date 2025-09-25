import { NextRequest, NextResponse } from 'next/server'
import { getTranslation } from '@/lib/i18n'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug translations endpoint called')
    
    // Verificar traducciones en español
    const spanishTranslations = {
      ceremony: getTranslation('es', 'home.packs.ceremony.price'),
      cocktail: getTranslation('es', 'home.packs.cocktail.price'),
      ceremonyCocktail1h: getTranslation('es', 'home.packs.ceremonyCocktail1h.price'),
      ceremonyCocktail1_5h: getTranslation('es', 'home.packs.ceremonyCocktail1_5h.price')
    }
    
    // Verificar traducciones en catalán
    const catalanTranslations = {
      ceremony: getTranslation('ca', 'home.packs.ceremony.price'),
      cocktail: getTranslation('ca', 'home.packs.cocktail.price'),
      ceremonyCocktail1h: getTranslation('ca', 'home.packs.ceremonyCocktail1h.price'),
      ceremonyCocktail1_5h: getTranslation('ca', 'home.packs.ceremonyCocktail1_5h.price')
    }
    
    return NextResponse.json({ 
      message: 'Debug translations endpoint working',
      spanish: spanishTranslations,
      catalan: catalanTranslations,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in debug translations endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
